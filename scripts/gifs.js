const masonryLayouts = document.querySelectorAll('.grid-images')

masonryLayouts.forEach(async container => {
  if (isMasonrySupported(container)) return

  const colGap = parseFloat(getComputedStyle(container).columnGap)
  const items = getChildren(container)

  container.style.gridAutoRows = '0px'
  container.style.setProperty('row-gap', '1px', 'important')
  
  try {
    await Promise.all([areImagesLoaded(container), areVideosLoaded(container)])
  } catch(e) {}
  
  layout({colGap, items})
  
  const observer = new ResizeObserver(observerFn)
  observer.observe(container)

  function observerFn(entries) {
    for (const entry of entries) {
      layout({colGap, items})
    }
  }

  masonryLayouts.forEach(async container => {
  const items = getChildren(container)

  items.forEach(item => {
    item.addEventListener('click', async (event) => {
        event.preventDefault();
        const imageUrl = event.target.src;

        try {
            await navigator.clipboard.writeText(imageUrl);

            item.classList.add('grid-image-animation');

            item.addEventListener('animationend', () => {
              item.classList.remove('grid-image-animation');
            }, { once: true });
        } catch (err) {
            console.error('Failed to copy link: ', err);
        }
    });
  })
})
})

function isMasonrySupported(container) {
  if (typeof window === 'undefined') return
  return getComputedStyle(container).gridTemplateRows === 'masonry'
}

function getChildren(container) {
  let children = container.children
  return Array.from(children)
}

async function areImagesLoaded(container) {
  const images = Array.from(container.querySelectorAll('img'))
  const promises = images.map(img => {
    return new Promise((resolve, reject) => {
      if (img.complete) return resolve()
      img.onload = resolve
      img.onerror = reject
    })
  })
  return Promise.all(promises)
}

function areVideosLoaded(container) {
  const videos = Array.from(container.querySelectorAll('video'))
  const promises = videos.map(video => {
    return new Promise((resolve, reject) => {
      if (video.readyState === 4) return resolve()
      video.onloadedmetadata = resolve
      video.onerror = reject
    })
  })
  return Promise.all(promises)
}

async function layout({colGap, items}) {
  items.forEach(item => {
    const ib = item.getBoundingClientRect()
    item.style.gridRowEnd = `span ${Math.round(ib.height + colGap)}`
  })
}