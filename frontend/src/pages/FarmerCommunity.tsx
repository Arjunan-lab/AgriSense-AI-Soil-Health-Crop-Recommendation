import { useState, useEffect, useRef } from 'react'
import {
  Search, Image as ImageIcon, MapPin, Tag, Heart, MessageCircle, Share2,
  Bookmark, Plus, TrendingUp, Users, Star, MoreHorizontal, X, Send, Loader2,
  AlertCircle, ZoomIn, ZoomOut, RotateCcw, CheckCircle2
} from 'lucide-react'
import { Button, Input } from '../components/ui'
import { communityAPI, PostItem, CommunityGroupItem, CommentItem, CommunityAnalyticsData } from '../api/community'
import { apiClient } from '../api/client'
import toast from 'react-hot-toast'

export default function FarmerCommunity({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [categories, setCategories] = useState<CommunityGroupItem[]>([])
  const [analytics, setAnalytics] = useState<CommunityAnalyticsData | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroupItem | null>(null)

  const [postText, setPostText] = useState('')
  const [postTags, setPostTags] = useState('')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [validationWarning, setValidationWarning] = useState<string | null>(null)

  const [loadingFeed, setLoadingFeed] = useState(false)
  const [posting, setPosting] = useState(false)
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Current logged in user state for sidebar card
  const [currentUser, setCurrentUser] = useState<{ name: string; avatar: string; location: string; role: string; postsCount: number } | null>(null)

  // Comments modal state
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [newCommentText, setNewCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  // Full-screen Image Viewer Modal State
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  // Initial Data Load
  useEffect(() => {
    fetchInitialData()
    fetchCurrentUserInfo()
  }, [])

  // Search or Filter change
  useEffect(() => {
    fetchFeedAndGroups()
  }, [searchQuery, selectedGroup])

  // ESC Listener to close image viewer modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerImageUrl(null)
        setZoomLevel(1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchInitialData = async () => {
    try {
      const [groupsData, analyticsData] = await Promise.all([
        communityAPI.getGroups().catch(() => []),
        communityAPI.getAnalytics().catch(() => null)
      ])
      setCategories(groupsData)
      if (analyticsData) setAnalytics(analyticsData)
    } catch (err) {
      console.error("Failed to load community initial data:", err)
    }
  }

  const fetchCurrentUserInfo = async () => {
    try {
      const { data } = await apiClient.get('/users/me')
      if (data) {
        const username = data.username || 'Farmer'
        const loc = data.district || data.state || 'Punjab, India'
        setCurrentUser({
          name: username,
          avatar: username.substring(0, 2).toUpperCase(),
          location: loc,
          role: (data.role || 'farmer').toUpperCase(),
          postsCount: 0,
        })
      }
    } catch (err) {
      console.warn("Could not fetch current user for community sidebar", err)
    }
  }

  const fetchFeedAndGroups = async () => {
    setLoadingFeed(true)
    try {
      const feedData = await communityAPI.getFeed({
        search: searchQuery || undefined,
        group_id: selectedGroup ? selectedGroup.id : undefined
      })
      setPosts(feedData.data || [])
    } catch (err) {
      console.error("Failed to fetch community feed:", err)
    } finally {
      setLoadingFeed(false)
    }
  }

  // Canvas Image Compression Helper for files > 1MB
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (file.size <= 1024 * 1024 || !file.type.startsWith('image/')) {
      return file
    }
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 1200
        let width = img.width
        let height = img.height
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            'image/jpeg',
            0.8
          )
        } else {
          resolve(file)
        }
      }
      img.onerror = () => resolve(file)
      img.src = URL.createObjectURL(file)
    })
  }

  // Handle Image File Selection & Validation
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationWarning(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Extension Validation
      const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      const extension = file.name.split('.').pop()?.toLowerCase()
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
      
      if (!validExtensions.includes(file.type) && (!extension || !allowedExts.includes(extension))) {
        setValidationWarning('Unsupported image format. Please select JPG, PNG, WEBP, or GIF.')
        toast.error('Unsupported image format. Please select JPG, PNG, WEBP, or GIF.')
        return
      }

      // Max Size Check (5MB raw limit)
      if (file.size > 5 * 1024 * 1024) {
        setValidationWarning('Image file size exceeds 5MB limit. Please choose a smaller image.')
        toast.error('Image file size exceeds 5MB limit.')
        return
      }

      setSelectedImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  // Create Post
  const handleCreatePost = async () => {
    setValidationWarning(null)

    // Validation: Require text or image
    if (!postText.trim() && !selectedImageFile) {
      setValidationWarning('Please enter text content or attach an image to create a post.')
      return
    }

    setPosting(true)
    setUploadProgressText(selectedImageFile ? 'Compressing & uploading image...' : 'Publishing post...')

    try {
      const formData = new FormData()
      if (postText.trim()) {
        formData.append('content', postText.trim())
      } else {
        formData.append('content', ' ')
      }

      if (selectedGroup) {
        formData.append('group_id', selectedGroup.id.toString())
      }
      if (postTags.trim()) {
        formData.append('tags', postTags.trim())
      }

      if (selectedImageFile) {
        const compressedFile = await compressImageIfNeeded(selectedImageFile)
        formData.append('image', compressedFile)
        setUploadProgressText('Uploading image through server...')
      }

      const newPost = await communityAPI.createPost(formData)
      setPosts(prev => [newPost, ...prev])
      setPostText('')
      setPostTags('')
      setSelectedImageFile(null)
      setImagePreviewUrl(null)
      toast.success('Post published successfully!')
      
      // Auto refresh feed
      fetchFeedAndGroups()
    } catch (err: any) {
      console.error("Failed to create post:", err)
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to create post. Please try again.'
      setValidationWarning(errorMsg)
      toast.error(errorMsg)
    } finally {
      setPosting(false)
      setUploadProgressText(null)
    }
  }

  // Like Toggle
  const toggleLike = async (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const nextLiked = !p.isLiked
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        }
      }
      return p
    }))

    try {
      const res = await communityAPI.toggleLike(id)
      setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: res.isLiked, likes: res.likes } : p))
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  // Bookmark / Save Toggle
  const toggleSave = async (id: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const nextSaved = !p.isSaved
        return {
          ...p,
          isSaved: nextSaved,
          bookmarks: nextSaved ? p.bookmarks + 1 : Math.max(0, p.bookmarks - 1)
        }
      }
      return p
    }))

    try {
      const res = await communityAPI.toggleBookmark(id)
      setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: res.isSaved, bookmarks: res.bookmarks } : p))
    } catch (err) {
      console.error("Failed to toggle bookmark:", err)
    }
  }

  // Join / Leave Group Toggle
  const toggleJoinGroup = async (group: CommunityGroupItem) => {
    try {
      const res = await communityAPI.toggleJoinGroup(group.id)
      setCategories(prev => prev.map(g => g.id === group.id ? { ...g, is_joined: res.is_joined, member_count: res.member_count } : g))
      if (selectedGroup && selectedGroup.id === group.id) {
        setSelectedGroup(prev => prev ? { ...prev, is_joined: res.is_joined, member_count: res.member_count } : null)
      }
    } catch (err) {
      console.error("Failed to join/leave group:", err)
    }
  }

  // Comments Modal Handlers
  const openComments = async (postId: number) => {
    setActiveCommentPostId(postId)
    setLoadingComments(true)
    try {
      const data = await communityAPI.getComments(postId)
      setComments(data)
    } catch (err) {
      console.error("Failed to load comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async () => {
    if (!activeCommentPostId || !newCommentText.trim()) return
    setSubmittingComment(true)
    try {
      const added = await communityAPI.addComment({
        post_id: activeCommentPostId,
        comment: newCommentText.trim()
      })
      setComments(prev => [...prev, added])
      setNewCommentText('')
      setPosts(prev => prev.map(p => p.id === activeCommentPostId ? { ...p, comments: p.comments + 1 } : p))
    } catch (err) {
      console.error("Failed to submit comment:", err)
    } finally {
      setSubmittingComment(false)
    }
  }

  // Format Helper for Member Count
  const formatMembers = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`
    return num.toString()
  }

  const trendingTags = analytics?.top_tags || ['#KharifSeason', '#MonsoonReady', '#OrganicYield', '#SoilHealth', '#SmartTractor']
  const topUsers = analytics?.most_active_users || []

  return (
    <div className="p-4 md:p-6 animate-fade-in max-w-7xl mx-auto h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Farmer Community</h2>
          <p className="text-sm text-text-muted">Connect, share, and learn with farmers worldwide</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              placeholder="Search community..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all w-full md:w-64"
            />
          </div>
          {selectedGroup && (
            <Button variant="outlined" size="sm" onClick={() => setSelectedGroup(null)}>
              Clear Filter ({selectedGroup.name})
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
        
        {/* Main Feed */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20 lg:pb-6 custom-scrollbar">
          
          {/* Categories Carousel */}
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(c => {
              const isSelected = selectedGroup?.id === c.id
              return (
                <div 
                  key={c.name} 
                  onClick={() => setSelectedGroup(isSelected ? null : c)}
                  className={`flex-shrink-0 bg-surface border rounded-xl p-3 flex items-center gap-3 hover:border-green-300 hover:shadow-soft transition-all cursor-pointer group ${isSelected ? 'border-green-500 bg-green-50/20' : 'border-border'}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {c.icon || '🌾'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary whitespace-nowrap">{c.name}</p>
                    <p className="text-xs text-text-muted">{formatMembers(c.member_count)} members</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleJoinGroup(c) }}
                    className={`ml-2 text-xs font-semibold px-2 py-1 rounded ${c.is_joined ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-background text-text-secondary border border-border hover:border-green-500'}`}
                  >
                    {c.is_joined ? 'Joined ✓' : '+ Join'}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Create Post */}
          <div className="bg-surface rounded-2xl shadow-card border border-border p-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex-shrink-0 flex items-center justify-center text-white font-bold">
                {currentUser?.avatar || 'RF'}
              </div>
              <div className="flex-1 space-y-3">
                <textarea 
                  placeholder={selectedGroup ? `Posting in #${selectedGroup.name}...` : "Share your farming journey, ask a question, or post an update..."}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:border-green-500 outline-none resize-none min-h-[80px]"
                  value={postText}
                  onChange={e => { setPostText(e.target.value); setValidationWarning(null); }}
                  disabled={posting}
                />
                
                {/* Warning Popup */}
                {validationWarning && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2 animate-fade-in">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span>{validationWarning}</span>
                  </div>
                )}

                {/* Upload Progress Bar */}
                {uploadProgressText && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2 animate-fade-in">
                    <Loader2 size={16} className="animate-spin text-blue-600 flex-shrink-0" />
                    <span>{uploadProgressText}</span>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreviewUrl && (
                  <div className="relative inline-block">
                    <img src={imagePreviewUrl} alt="Selected Image Preview" className="h-28 w-auto rounded-xl object-cover border border-border shadow-sm" />
                    <button 
                      onClick={() => { setSelectedImageFile(null); setImagePreviewUrl(null); setValidationWarning(null); }}
                      disabled={posting}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <div className="flex gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageFileChange} 
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                      className="hidden" 
                      disabled={posting}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={posting}
                      className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors border border-border"
                    >
                      <ImageIcon size={16} className="text-green-600" />
                      <span>{selectedImageFile ? 'Change Image' : 'Add Image'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        const tag = prompt("Enter tags (comma separated):", postTags)
                        if (tag !== null) setPostTags(tag)
                      }}
                      disabled={posting}
                      className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors border border-border"
                    >
                      <Tag size={16} className="text-blue-500" /> {postTags ? `#${postTags}` : 'Tag Crop'}
                    </button>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleCreatePost} disabled={posting}>
                    {posting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={14} className="animate-spin" /> Posting...
                      </span>
                    ) : 'Post Update'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {loadingFeed ? (
              <div className="flex flex-col items-center justify-center p-12 text-text-muted text-sm gap-2">
                <Loader2 className="animate-spin text-green-600" size={24} />
                <span>Loading farmer posts...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-border">
                <p className="text-text-muted font-medium">No community posts found.</p>
                <p className="text-xs text-text-muted mt-1">Be the first farmer to share an update!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
                  <div className="p-4 md:p-5">
                    {/* Author Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {post.author.avatar || 'RF'}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm flex items-center gap-1">
                            {post.author.name}
                            <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-1.5 py-0.5 rounded ml-1 font-semibold">
                              {post.author.role}
                            </span>
                            {post.community_name && (
                              <span className="text-[11px] text-text-muted ml-1">in <span className="font-semibold text-green-600">#{post.community_name}</span></span>
                            )}
                          </p>
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {post.author.location} • {post.time}
                          </p>
                        </div>
                      </div>
                      <button className="text-text-muted hover:text-text-primary p-1"><MoreHorizontal size={18} /></button>
                    </div>
                    
                    {/* Content */}
                    {post.title && <h4 className="font-bold text-text-primary text-base mb-2">{post.title}</h4>}
                    {post.content && post.content.trim() !== '' && (
                      <p className="text-sm text-text-primary leading-relaxed mb-4 whitespace-pre-line">{post.content}</p>
                    )}
                    
                    {/* Optional Image with Modal Viewer Trigger */}
                    {post.image && (
                      <div 
                        onClick={() => { setViewerImageUrl(post.image || null); setZoomLevel(1); }}
                        className="rounded-xl overflow-hidden mb-4 border border-border cursor-pointer group relative bg-black/5"
                      >
                        <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-96 object-cover group-hover:scale-[1.01] transition-transform duration-300" />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <ZoomIn size={14} /> Click to View
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1 sm:gap-4">
                        <button 
                          onClick={() => toggleLike(post.id)} 
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${post.isLiked ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-text-secondary hover:bg-background'}`}
                        >
                          <Heart size={16} className={post.isLiked ? 'fill-current' : ''} /> {post.likes}
                        </button>
                        <button 
                          onClick={() => openComments(post.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:bg-background px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <MessageCircle size={16} /> {post.comments}
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard?.writeText(window.location.href)
                            toast.success('Post link copied to clipboard!')
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:bg-background px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Share2 size={16} /> Share
                        </button>
                      </div>
                      <button 
                        onClick={() => toggleSave(post.id)} 
                        className={`p-2 rounded-lg transition-colors ${post.isSaved ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-text-secondary hover:bg-background'}`}
                      >
                        <Bookmark size={18} className={post.isSaved ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6 overflow-y-auto pb-20 lg:pb-6 custom-scrollbar hidden lg:block">
          {/* Profile Preview */}
          <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <div className="px-5 pb-5 relative">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold border-4 border-surface absolute -top-8 left-5 shadow-sm">
                {currentUser?.avatar || 'RF'}
              </div>
              <div className="pt-10">
                <h3 className="font-bold text-text-primary text-base">{currentUser?.name || 'Farmer User'}</h3>
                <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {currentUser?.location || 'India'}
                </p>
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-center">
                  <div>
                    <p className="text-xs text-text-muted">Role</p>
                    <p className="font-bold text-sm text-green-600">{currentUser?.role || 'FARMER'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Posts</p>
                    <p className="font-bold text-sm text-text-primary">{posts.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-surface rounded-2xl shadow-card border border-border p-5">
            <h3 className="font-bold text-text-primary text-sm mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" /> Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="text-xs font-medium text-text-secondary bg-background hover:bg-green-50 hover:text-green-600 border border-border px-2.5 py-1 rounded-lg transition-colors"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Viewer Modal */}
      {viewerImageUrl && (
        <div 
          onClick={() => { setViewerImageUrl(null); setZoomLevel(1); }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
        >
          {/* Controls Bar */}
          <div 
            onClick={e => e.stopPropagation()}
            className="absolute top-4 right-4 flex items-center gap-2 bg-surface/80 border border-border rounded-xl p-2 shadow-lg backdrop-blur-sm z-50"
          >
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={18} />
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button 
              onClick={() => { setViewerImageUrl(null); setZoomLevel(1); }}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Close (ESC)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image Canvas */}
          <div 
            onClick={e => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] overflow-auto flex items-center justify-center transition-all duration-200"
          >
            <img 
              src={viewerImageUrl} 
              alt="Enlarged Post Attachment" 
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl transition-transform duration-200"
            />
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {activeCommentPostId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col border border-border shadow-2xl animate-scale-up">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-text-primary text-base">Comments</h3>
              <button onClick={() => setActiveCommentPostId(null)} className="text-text-muted hover:text-text-primary p-1">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {loadingComments ? (
                <div className="flex justify-center p-6"><Loader2 className="animate-spin text-green-600" size={24} /></div>
              ) : comments.length === 0 ? (
                <p className="text-text-muted text-center py-6 text-sm">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      {c.user_avatar || c.user_name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="bg-background rounded-xl p-3 flex-1 border border-border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-text-primary text-xs">{c.user_name}</span>
                        <span className="text-[10px] text-text-muted">{c.created_at}</span>
                      </div>
                      <p className="text-text-secondary text-xs">{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <input 
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:border-green-500 outline-none"
              />
              <Button variant="primary" size="sm" onClick={handleAddComment} disabled={submittingComment || !newCommentText.trim()}>
                {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
