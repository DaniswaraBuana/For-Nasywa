// State
let currentPage = 1;
const totalPages = 4;

// Flower HTML template
const flowersHTML = `
<div class="flowers">
  <div class="flower flower--1">
    <div class="flower__leafs flower__leafs--1">
      <div class="flower__leaf flower__leaf--1"></div>
      <div class="flower__leaf flower__leaf--2"></div>
      <div class="flower__leaf flower__leaf--3"></div>
      <div class="flower__leaf flower__leaf--4"></div>
      <div class="flower__white-circle"></div>
      <div class="flower__light flower__light--1"></div>
      <div class="flower__light flower__light--2"></div>
      <div class="flower__light flower__light--3"></div>
      <div class="flower__light flower__light--4"></div>
      <div class="flower__light flower__light--5"></div>
      <div class="flower__light flower__light--6"></div>
      <div class="flower__light flower__light--7"></div>
      <div class="flower__light flower__light--8"></div>
    </div>
    <div class="flower__line">
      <div class="flower__line__leaf flower__line__leaf--1"></div>
      <div class="flower__line__leaf flower__line__leaf--2"></div>
      <div class="flower__line__leaf flower__line__leaf--3"></div>
      <div class="flower__line__leaf flower__line__leaf--4"></div>
      <div class="flower__line__leaf flower__line__leaf--5"></div>
      <div class="flower__line__leaf flower__line__leaf--6"></div>
    </div>
  </div>

  <div class="flower flower--2">
    <div class="flower__leafs flower__leafs--2">
      <div class="flower__leaf flower__leaf--1"></div>
      <div class="flower__leaf flower__leaf--2"></div>
      <div class="flower__leaf flower__leaf--3"></div>
      <div class="flower__leaf flower__leaf--4"></div>
      <div class="flower__white-circle"></div>
      <div class="flower__light flower__light--1"></div>
      <div class="flower__light flower__light--2"></div>
      <div class="flower__light flower__light--3"></div>
      <div class="flower__light flower__light--4"></div>
      <div class="flower__light flower__light--5"></div>
      <div class="flower__light flower__light--6"></div>
      <div class="flower__light flower__light--7"></div>
      <div class="flower__light flower__light--8"></div>
    </div>
    <div class="flower__line">
      <div class="flower__line__leaf flower__line__leaf--1"></div>
      <div class="flower__line__leaf flower__line__leaf--2"></div>
      <div class="flower__line__leaf flower__line__leaf--3"></div>
      <div class="flower__line__leaf flower__line__leaf--4"></div>
    </div>
  </div>

  <div class="flower flower--3">
    <div class="flower__leafs flower__leafs--3">
      <div class="flower__leaf flower__leaf--1"></div>
      <div class="flower__leaf flower__leaf--2"></div>
      <div class="flower__leaf flower__leaf--3"></div>
      <div class="flower__leaf flower__leaf--4"></div>
      <div class="flower__white-circle"></div>
      <div class="flower__light flower__light--1"></div>
      <div class="flower__light flower__light--2"></div>
      <div class="flower__light flower__light--3"></div>
      <div class="flower__light flower__light--4"></div>
      <div class="flower__light flower__light--5"></div>
      <div class="flower__light flower__light--6"></div>
      <div class="flower__light flower__light--7"></div>
      <div class="flower__light flower__light--8"></div>
    </div>
    <div class="flower__line">
      <div class="flower__line__leaf flower__line__leaf--1"></div>
      <div class="flower__line__leaf flower__line__leaf--2"></div>
      <div class="flower__line__leaf flower__line__leaf--3"></div>
      <div class="flower__line__leaf flower__line__leaf--4"></div>
    </div>
  </div>

  <div class="grow-ans" style="--d:1.2s">
    <div class="flower__g-long">
      <div class="flower__g-long__top"></div>
      <div class="flower__g-long__bottom"></div>
    </div>
  </div>

  <div class="growing-grass">
    <div class="flower__grass flower__grass--1">
      <div class="flower__grass--top"></div>
      <div class="flower__grass--bottom"></div>
      <div class="flower__grass__leaf flower__grass__leaf--1"></div>
      <div class="flower__grass__leaf flower__grass__leaf--2"></div>
      <div class="flower__grass__leaf flower__grass__leaf--3"></div>
      <div class="flower__grass__leaf flower__grass__leaf--4"></div>
      <div class="flower__grass__leaf flower__grass__leaf--5"></div>
      <div class="flower__grass__leaf flower__grass__leaf--6"></div>
      <div class="flower__grass__leaf flower__grass__leaf--7"></div>
      <div class="flower__grass__leaf flower__grass__leaf--8"></div>
      <div class="flower__grass__overlay"></div>
    </div>
  </div>

  <div class="growing-grass">
    <div class="flower__grass flower__grass--2">
      <div class="flower__grass--top"></div>
      <div class="flower__grass--bottom"></div>
      <div class="flower__grass__leaf flower__grass__leaf--1"></div>
      <div class="flower__grass__leaf flower__grass__leaf--2"></div>
      <div class="flower__grass__leaf flower__grass__leaf--3"></div>
      <div class="flower__grass__leaf flower__grass__leaf--4"></div>
      <div class="flower__grass__leaf flower__grass__leaf--5"></div>
      <div class="flower__grass__leaf flower__grass__leaf--6"></div>
      <div class="flower__grass__leaf flower__grass__leaf--7"></div>
      <div class="flower__grass__leaf flower__grass__leaf--8"></div>
      <div class="flower__grass__overlay"></div>
    </div>
  </div>

  <div class="grow-ans" style="--d:2.4s">
    <div class="flower__g-right flower__g-right--1"><div class="leaf"></div></div>
  </div>

  <div class="grow-ans" style="--d:2.8s">
    <div class="flower__g-right flower__g-right--2"><div class="leaf"></div></div>
  </div>

  <div class="grow-ans" style="--d:2.8s">
    <div class="flower__g-front">
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--5"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--6"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--7"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--8"><div class="flower__g-front__leaf"></div></div>
      <div class="flower__g-front__line"></div>
    </div>
  </div>

  <div class="grow-ans" style="--d:3.2s">
    <div class="flower__g-fr">
      <div class="leaf"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--1"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--2"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--3"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--4"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--5"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--6"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--7"></div>
      <div class="flower__g-fr__leaf flower__g-fr__leaf--8"></div>
    </div>
  </div>

  <div class="long-g long-g--0">
    <div class="grow-ans" style="--d:3s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:2.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:3.4s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--1">
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:3.8s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:4s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--2">
    <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:4.4s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:4.6s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--3">
    <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--4">
    <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--5">
    <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--6">
    <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:4.4s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:4.6s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:4.8s"><div class="leaf leaf--3"></div></div>
  </div>

  <div class="long-g long-g--7">
    <div class="grow-ans" style="--d:3s"><div class="leaf leaf--0"></div></div>
    <div class="grow-ans" style="--d:3.2s"><div class="leaf leaf--1"></div></div>
    <div class="grow-ans" style="--d:3.5s"><div class="leaf leaf--2"></div></div>
    <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
  </div>
</div>
`;

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    // Remove container class to enable animations
    document.body.classList.remove('container');
    
    // Insert flowers into containers
    document.getElementById('flowers-container').innerHTML = flowersHTML;
    document.getElementById('flowers-container-2').innerHTML = flowersHTML;
    
    // Setup navigation
    setupNavigation();
    setupFlowerInteraction();
    updateUI();
});

function setupFlowerInteraction() {
    const flowersContainer = document.getElementById('flowers-container');
    const valentineText = document.getElementById('valentine-text');
    const clickHint = document.getElementById('click-hint');
    
    if (flowersContainer && valentineText && clickHint) {
        // Hover to show
        flowersContainer.addEventListener('mouseenter', function() {
            valentineText.classList.remove('hidden');
            valentineText.classList.add('show');
            clickHint.style.opacity = '0';
        });
        
        // Keep showing when hover out
        flowersContainer.addEventListener('mouseleave', function() {
            // Text stays visible
        });
        
        console.log('Flower hover interaction ready');
    }
}

function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    // Next button
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    
    // Previous button
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const page = parseInt(dot.dataset.page);
            goToPage(page);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentPage < totalPages) {
            goToPage(currentPage + 1);
        } else if (e.key === 'ArrowLeft' && currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });
}

function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    // Remove active from current page
    document.getElementById(`page${currentPage}`).classList.remove('active');
    
    // Update current page
    currentPage = pageNum;
    
    // Add active to new page
    document.getElementById(`page${currentPage}`).classList.add('active');
    
    // Update UI
    updateUI();
}

function updateUI() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    // Update buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Update dots
    dots.forEach(dot => {
        const page = parseInt(dot.dataset.page);
        dot.classList.toggle('active', page === currentPage);
    });
}
