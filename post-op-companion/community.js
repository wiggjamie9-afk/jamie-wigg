// Community & Peer Support
class CommunitySupport {
  constructor(app) {
    this.app = app;
    this.state = app.state;
    if (!this.state.community) {
      this.state.community = {
        stories: [],
        userStory: '',
        challenges: [],
      };
    }
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadCommunityData();
  }

  setupEventListeners() {
    const findPeerBtn = document.getElementById('find-peer-btn');
    if (findPeerBtn) {
      findPeerBtn.addEventListener('click', () => this.findPeers());
    }

    const shareStoryBtn = document.getElementById('share-story-btn');
    if (shareStoryBtn) {
      shareStoryBtn.addEventListener('click', () => this.promptShareStory());
    }
  }

  findPeers() {
    const currentMonth = this.app.state.user.currentMonth || 1;
    const peers = [
      {
        month: currentMonth - 1,
        name: 'Anonymous (Month ' + (currentMonth - 1) + ')',
        goal: 'Just finished Month ' + (currentMonth - 1) + ' — ask me anything!',
      },
      {
        month: currentMonth + 1,
        name: 'Anonymous (Month ' + (currentMonth + 1) + ')',
        goal: 'Looking back, here\'s what I wish I\'d known earlier',
      },
      {
        month: 6,
        name: 'Anonymous (Month 6)',
        goal: 'Just started lifting — ask about exercise progression',
      },
    ];

    const peerList = document.getElementById('peer-list');
    if (peerList) {
      peerList.innerHTML = peers.map(peer => `
        <div class="peer-card">
          <h4>👤 ${peer.name}</h4>
          <p>"${peer.goal}"</p>
          <button class="btn-secondary" onclick="alert('In a full app, you would connect via messaging. For now, check Reddit r/BariatricSurgery or Facebook groups.')">Connect</button>
        </div>
      `).join('');
    }
  }

  promptShareStory() {
    const story = prompt('Share your story anonymously (2-3 sentences):', '');
    if (story) {
      this.addStory(story);
    }
  }

  addStory(storyText) {
    const story = {
      id: Date.now().toString(),
      text: storyText,
      month: this.app.state.user.currentMonth || 1,
      date: new Date().toLocaleDateString(),
      likes: 0,
    };

    this.state.community.stories.push(story);
    this.app.saveState();
    if (window.voice) {
      window.voice.speak("Thank you for sharing. Your story could be exactly what someone else needs to hear today. You're not alone in this.");
    }
    alert('✓ Story shared anonymously! Thank you for helping others.');
    this.loadCommunityData();
  }

  loadCommunityData() {
    // Load stories
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      const stories = this.state.community.stories || [];
      if (stories.length === 0) {
        storiesList.innerHTML = '<p class="placeholder">Be the first to share your story!</p>';
      } else {
        storiesList.innerHTML = stories.map(story => `
          <div class="story-card">
            <div class="story-header">
              <span class="story-month">Month ${story.month}</span>
              <span class="story-date">${story.date}</span>
            </div>
            <p class="story-text">"${story.text}"</p>
            <button class="btn-mini" data-story-id="${story.id}">❤️ ${story.likes}</button>
          </div>
        `).join('');

        // Add like listeners
        document.querySelectorAll('.story-card .btn-mini').forEach(btn => {
          btn.addEventListener('click', () => {
            const storyId = btn.dataset.storyId;
            const story = this.state.community.stories.find(s => s.id === storyId);
            if (story) {
              story.likes += 1;
              this.app.saveState();
              this.loadCommunityData();
            }
          });
        });
      }
    }

    // Load challenges
    this.loadChallenges();
  }

  loadChallenges() {
    const challengesList = document.getElementById('challenges-list');
    if (!challengesList) return;

    const challenges = [
      {
        name: 'Hydration Challenge',
        description: 'Drink 80oz water daily for 7 days',
        duration: '7 days',
        icon: '💧',
      },
      {
        name: 'Walking Challenge',
        description: 'Walk 10 min daily (or more if post-op phase allows)',
        duration: '14 days',
        icon: '🚶',
      },
      {
        name: 'Meal Prep Challenge',
        description: 'Prep all meals for one week according to plan',
        duration: '1 week',
        icon: '🍽️',
      },
      {
        name: 'Sleep Challenge',
        description: 'Get 7-8 hours sleep for 5 nights',
        duration: '5 days',
        icon: '😴',
      },
    ];

    challengesList.innerHTML = challenges.map(challenge => `
      <div class="challenge-card">
        <div class="challenge-header">
          <h4>${challenge.icon} ${challenge.name}</h4>
          <span class="duration">${challenge.duration}</span>
        </div>
        <p>${challenge.description}</p>
        <button class="btn-secondary">Join Challenge</button>
      </div>
    `).join('');

    // Add join listeners
    document.querySelectorAll('.challenge-card .btn-secondary').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.textContent = '✓ Joined!';
        btn.disabled = true;
        btn.style.opacity = '0.5';
      });
    });
  }

  // Helper: Get month-appropriate peers
  getSuggestedPeers(currentMonth) {
    const suggestions = [];
    if (currentMonth === 1) {
      suggestions.push('Other Month 1 patients (fresh post-op)');
      suggestions.push('Month 2-3 patients (just ahead, remember early struggles)');
    } else if (currentMonth <= 3) {
      suggestions.push(`Other Month ${currentMonth} patients (same recovery phase)`);
      suggestions.push(`Month ${currentMonth + 1}-2 patients (slightly ahead)`);
    } else if (currentMonth <= 6) {
      suggestions.push(`Month ${currentMonth} patients (build phase)`);
      suggestions.push('Month 7-9 patients (can share fitness tips)');
    } else {
      suggestions.push(`Month ${currentMonth} patients`);
      suggestions.push('Month 10-12 patients (final stretch)');
    }
    return suggestions;
  }
}
