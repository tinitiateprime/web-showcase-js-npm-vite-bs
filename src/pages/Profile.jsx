import React, { useState, useEffect } from 'react';
import { Camera, Edit3, MapPin, Calendar, Mail, Phone, Globe, Award, Users, Heart, MessageCircle, Share2, Star, TrendingUp, Activity, Shield, Settings, MoreHorizontal, Plus, Eye } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [profileViews, setProfileViews] = useState(1247);
  const [isEditing, setIsEditing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Mock data
  const userData = {
    name: "Alexandra Chen",
    username: "@alexandra_chen",
    bio: "Full-stack developer passionate about creating beautiful, functional experiences. Coffee enthusiast ☕ | Tech speaker 🎤 | Open source contributor 💻",
    location: "San Francisco, CA",
    website: "alexandra-chen.dev",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "March 2020",
    followers: 2847,
    following: 1203,
    posts: 342,
    verified: true,
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
  };

  const skills = [
    { name: "React", level: 95, color: "primary" },
    { name: "Node.js", level: 88, color: "success" },
    { name: "TypeScript", level: 92, color: "info" },
    { name: "Python", level: 85, color: "warning" },
    { name: "AWS", level: 78, color: "danger" }
  ];

  const posts = [
    {
      id: 1,
      content: "Just shipped a new feature that improves user experience by 40%! The power of thoughtful design and clean code 🚀",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      likes: 124,
      comments: 23,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      content: "Speaking at ReactConf next month about building accessible components. Excited to share what I've learned!",
      likes: 89,
      comments: 15,
      timestamp: "1 day ago"
    },
    {
      id: 3,
      content: "Open source contribution of the week: Added dark mode support to a popular component library 🌙",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop",
      likes: 156,
      comments: 31,
      timestamp: "3 days ago"
    }
  ];

  const achievements = [
    { icon: "🏆", title: "Top Contributor", description: "Recognized as top contributor in 2024" },
    { icon: "⭐", title: "5-Star Rating", description: "Maintained 5-star rating for 2 years" },
    { icon: "🚀", title: "Innovation Award", description: "Won company innovation award" },
    { icon: "👥", title: "Mentor of the Year", description: "Mentored 50+ developers" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const StatCard = ({ icon: Icon, value, label, color = "primary" }) => (
    <div className={`card border-0 shadow-sm h-100 stat-card-${color}`}>
      <div className="card-body text-center">
        <Icon size={24} className={`text-${color} mb-2`} />
        <h4 className={`fw-bold text-${color} mb-1 counter`}>{value}</h4>
        <small className="text-muted">{label}</small>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
      <style jsx>{`
        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }
        
        .profile-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 1;
        }
        
        .profile-content {
          position: relative;
          z-index: 2;
        }
        
        .profile-avatar {
          width: 150px;
          height: 150px;
          border: 6px solid white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: transform 0.3s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.05);
        }
        
        .floating-card {
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .skill-progress {
          height: 8px;
          border-radius: 20px;
          overflow: hidden;
          background: #e9ecef;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .skill-progress .progress-bar {
          border-radius: 20px;
          transition: width 1s ease-in-out;
        }
        
        .post-card {
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.4);
        }
        
        .stat-card-primary { border-left: 4px solid #0d6efd; }
        .stat-card-success { border-left: 4px solid #198754; }
        .stat-card-info { border-left: 4px solid #0dcaf0; }
        .stat-card-warning { border-left: 4px solid #ffc107; }
        .stat-card-danger { border-left: 4px solid #dc3545; }
        
        .counter {
          animation: ${showStats ? 'countUp 1s ease-out' : 'none'};
        }
        
        @keyframes countUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .achievement-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .achievement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        
        .glass-effect {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .nav-pills .nav-link {
          border-radius: 25px;
          transition: all 0.3s ease;
        }
        
        .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.3);
        }
        
        .like-button {
          transition: all 0.3s ease;
        }
        
        .like-button.liked {
          color: #e91e63;
          transform: scale(1.1);
        }
        
        .verified-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }
      `}</style>

      {/* Header Section */}
      <div className="profile-header" style={{ backgroundImage: `url(${userData.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="profile-content">
          <div className="container py-5">
            <div className="row align-items-end">
              <div className="col-lg-3 text-center text-lg-start">
                <div className="position-relative d-inline-block">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="profile-avatar rounded-circle"
                  />
                  <button className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 end-0 p-2">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
              <div className="col-lg-6 mt-3 mt-lg-0">
                <div className="text-white">
                  <h1 className="fw-bold mb-1 d-flex align-items-center">
                    {userData.name}
                    {userData.verified && <span className="verified-badge ms-2">✓ Verified</span>}
                  </h1>
                  <p className="text-white-50 mb-2">{userData.username}</p>
                  <p className="mb-3 lead">{userData.bio}</p>
                  <div className="d-flex flex-wrap gap-3 small">
                    <span><MapPin size={16} className="me-1" />{userData.location}</span>
                    <span><Calendar size={16} className="me-1" />Joined {userData.joinDate}</span>
                    <span><Globe size={16} className="me-1" />{userData.website}</span>
                    <span><Eye size={16} className="me-1" />{profileViews} profile views</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 mt-3 mt-lg-0">
                <div className="d-flex gap-2 justify-content-center justify-content-lg-end">
                  <button 
                    className={`btn ${isFollowing ? 'btn-outline-light' : 'btn-light'} px-4 fw-semibold`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn btn-outline-light">
                    <MessageCircle size={16} />
                  </button>
                  <button className="btn btn-outline-light">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mt-n4 position-relative" style={{ zIndex: 10 }}>
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <StatCard icon={Users} value={userData.followers.toLocaleString()} label="Followers" color="primary" />
          </div>
          <div className="col-md-3">
            <StatCard icon={Heart} value={userData.following.toLocaleString()} label="Following" color="success" />
          </div>
          <div className="col-md-3">
            <StatCard icon={Activity} value={userData.posts} label="Posts" color="info" />
          </div>
          <div className="col-md-3">
            <StatCard icon={TrendingUp} value="98%" label="Engagement" color="warning" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mb-4">
        <ul className="nav nav-pills justify-content-center gap-2">
          {['overview', 'posts', 'skills', 'achievements'].map(tab => (
            <li className="nav-item" key={tab}>
              <button 
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content Sections */}
      <div className="container pb-5">
        <div className="row">
          <div className="col-lg-8">
            {activeTab === 'overview' && (
              <div className="card floating-card mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">About</h5>
                    <button className="btn btn-sm btn-outline-primary">
                      <Edit3 size={14} className="me-1" />
                      Edit
                    </button>
                  </div>
                  <p className="text-muted mb-3">{userData.bio}</p>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Mail size={16} className="text-muted me-2" />
                        <span className="small">{userData.email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <Phone size={16} className="text-muted me-2" />
                        <span className="small">{userData.phone}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-2">
                        <Globe size={16} className="text-muted me-2" />
                        <a href={`https://${userData.website}`} className="small text-decoration-none">
                          {userData.website}
                        </a>
                      </div>
                      <div className="d-flex align-items-center">
                        <MapPin size={16} className="text-muted me-2" />
                        <span className="small">{userData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="card post-card mb-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <img 
                          src={userData.profileImage} 
                          alt="Profile" 
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px' }}
                        />
                        <div>
                          <h6 className="mb-0">{userData.name}</h6>
                          <small className="text-muted">{post.timestamp}</small>
                        </div>
                      </div>
                      <p className="mb-3">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post" 
                          className="img-fluid rounded mb-3"
                          style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                        />
                      )}
                      <div className="d-flex align-items-center gap-4">
                        <button 
                          className={`btn btn-sm btn-outline-primary like-button ${likedPosts.has(post.id) ? 'liked' : ''}`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart size={14} className="me-1" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <MessageCircle size={14} className="me-1" />
                          {post.comments}
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <Share2 size={14} className="me-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="card floating-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">Technical Skills</h5>
                    <button className="btn btn-sm btn-outline-primary">
                      <Plus size={14} className="me-1" />
                      Add Skill
                    </button>
                  </div>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-medium">{skill.name}</span>
                          <span className="text-muted small">{skill.level}%</span>
                        </div>
                        <div className="skill-progress">
                          <div 
                            className={`progress-bar bg-${skill.color}`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="row g-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card achievement-card h-100">
                      <div className="card-body text-center p-4">
                        <div className="fs-1 mb-3">{achievement.icon}</div>
                        <h6 className="fw-bold mb-2">{achievement.title}</h6>
                        <p className="text-muted small mb-0">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card floating-card mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Quick Actions</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-gradient text-white">
                    <MessageCircle size={16} className="me-2" />
                    Send Message
                  </button>
                  <button className="btn btn-outline-primary">
                    <Settings size={16} className="me-2" />
                    Settings
                  </button>
                  <button className="btn btn-outline-secondary">
                    <Shield size={16} className="me-2" />
                    Privacy
                  </button>
                </div>
              </div>
            </div>

            <div className="card floating-card">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Activity Overview</h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted small">This Month</span>
                  <span className="badge bg-primary">+24%</span>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small">Profile Views</span>
                    <span className="fw-semibold">2.1K</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-primary" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small">Engagement</span>
                    <span className="fw-semibold">1.8K</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small">New Followers</span>
                    <span className="fw-semibold">234</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-info" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
