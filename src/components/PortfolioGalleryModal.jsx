import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

function FullscreenViewer({ src, alt, onClose }) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const panStart = useRef(null)
  const pinchStart = useRef(null)
  const animate = useRef(true)

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const resetZoom = () => {
    animate.current = true
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleDoubleClick = (event) => {
    event.stopPropagation()
    animate.current = true
    if (scale === 1) {
      setScale(2.4)
    } else {
      resetZoom()
    }
  }

  const handlePointerDown = (event) => {
    if (scale > 1 && event.pointerType !== 'touch') {
      panStart.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    }
  }
  const handlePointerMove = (event) => {
    if (panStart.current && scale > 1) {
      animate.current = false
      setOffset({ x: event.clientX - panStart.current.x, y: event.clientY - panStart.current.y })
    }
  }
  const handlePointerUp = () => {
    panStart.current = null
  }

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      pinchStart.current = { dist: Math.hypot(dx, dy), scale }
    } else if (event.touches.length === 1 && scale > 1) {
      panStart.current = {
        x: event.touches[0].clientX - offset.x,
        y: event.touches[0].clientY - offset.y,
      }
    }
  }
  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && pinchStart.current) {
      event.preventDefault()
      const dx = event.touches[0].clientX - event.touches[1].clientX
      const dy = event.touches[0].clientY - event.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.max(1, Math.min(4, pinchStart.current.scale * (dist / pinchStart.current.dist)))
      animate.current = false
      setScale(next)
    } else if (event.touches.length === 1 && panStart.current && scale > 1) {
      event.preventDefault()
      animate.current = false
      setOffset({
        x: event.touches[0].clientX - panStart.current.x,
        y: event.touches[0].clientY - panStart.current.y,
      })
    }
  }
  const handleTouchEnd = () => {
    pinchStart.current = null
    panStart.current = null
    if (scale < 1.05) {
      resetZoom()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[120] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen image"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close fullscreen"
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {scale === 1 && (
        <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 font-['Source_Serif_4'] text-[0.72rem] text-white/70 backdrop-blur-sm">
          Double-tap or pinch to zoom
        </span>
      )}

      <div
        className="flex h-full w-full items-center justify-center overflow-hidden"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-h-full max-w-full select-none object-contain"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: animate.current ? 'transform 0.25s ease-out' : 'none',
            cursor: scale > 1 ? 'grab' : 'zoom-in',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function PortfolioGalleryModal({ images, title, onClose }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const closeButtonRef = useRef(null)

  const go = useCallback(
    (dir) => {
      setDirection(dir)
      setIndex((current) => (current + dir + images.length) % images.length)
    },
    [images.length]
  )

  useEffect(() => {
    const handler = (event) => {
      if (fullscreen) return
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, onClose, fullscreen])

  useEffect(() => {
    const previousActive = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      previousActive?.focus?.()
    }
  }, [])

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-gallery-title"
    >
      <div className="absolute inset-0 bg-[#0D0A08]/94 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-[1180px] flex-col items-center sm:px-4 sm:py-6">
        <h3 id="portfolio-gallery-title" className="sr-only">
          {title} gallery
        </h3>

        <div className="mb-3 hidden w-full items-end justify-between px-2 sm:flex">
          <div>
            <p className="font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]/80">
              Portfolio · Gallery
            </p>
            <h2 className="mt-1 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-white">
              {title}
            </h2>
          </div>
          <motion.button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-white/5 text-white/80 transition-colors hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-white"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Close gallery"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        <motion.button
          onClick={onClose}
          className="absolute -top-11 right-3 z-20 text-white/70 transition-colors hover:text-white sm:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close gallery"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1C1714] shadow-2xl sm:aspect-[16/10] sm:rounded-[16px] sm:border sm:border-[#D4AF37]/22 sm:shadow-[0_40px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,175,55,0.08)]">
          <div className="pointer-events-none absolute inset-0 z-20 hidden rounded-[16px] ring-1 ring-inset ring-[#D4AF37]/10 sm:block" />
          <div className="absolute inset-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.button
                key={index}
                type="button"
                onClick={() => setFullscreen(true)}
                aria-label="Open fullscreen"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
              >
                <img
                  src={images[index].src}
                  alt={images[index].alt}
                  className="h-full w-full object-cover sm:object-contain"
                  draggable={false}
                />
              </motion.button>
            </AnimatePresence>

            {[-1, 1].map((dir) => (
              <div
                key={dir}
                className={`absolute top-1/2 z-10 -translate-y-1/2 ${
                  dir === -1 ? 'left-3 sm:left-5' : 'right-3 sm:right-5'
                }`}
              >
                <motion.button
                  onClick={(event) => {
                    event.stopPropagation()
                    go(dir)
                  }}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-black/45 text-white backdrop-blur-md transition-colors hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/18 sm:h-14 sm:w-14"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label={dir === -1 ? 'Previous' : 'Next'}
                >
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={dir === -1 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                    />
                  </svg>
                </motion.button>
              </div>
            ))}

            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 font-['Source_Serif_4'] text-[0.68rem] text-white/75 backdrop-blur-sm sm:hidden">
              Tap to zoom
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 px-4 sm:hidden">
          <span className="font-['Source_Serif_4'] text-[0.8rem] tabular-nums text-white/40">
            {index + 1} / {images.length}
          </span>
          <div className="flex gap-1.5">
            {images.map((_, imageIndex) => (
              <motion.button
                key={imageIndex}
                onClick={() => {
                  setDirection(imageIndex > index ? 1 : -1)
                  setIndex(imageIndex)
                }}
                className="h-1.5 rounded-full"
                animate={{
                  width: imageIndex === index ? 20 : 6,
                  backgroundColor:
                    imageIndex === index ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                }}
                transition={{ duration: 0.3 }}
                aria-label={`Go to image ${imageIndex + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-3 px-4 text-center font-['Source_Serif_4'] text-[0.8125rem] tracking-wide text-white/40 sm:hidden">
          {title} - {images[index].label}
        </p>

        <div className="mt-5 hidden w-full items-center justify-between gap-6 px-2 sm:flex">
          <p className="font-['Source_Serif_4'] text-[0.9rem] italic text-white/55">
            {images[index].label}
          </p>
          <span className="flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/50">
            <span className="h-px w-6 bg-[#D4AF37]/45" />
            <span className="tabular-nums text-[#D4AF37]">{String(index + 1).padStart(2, '0')}</span>
            <span className="text-white/30">/</span>
            <span className="tabular-nums text-white/50">{String(images.length).padStart(2, '0')}</span>
          </span>
        </div>

        <div
          className="mt-4 hidden w-full gap-2 overflow-x-auto px-2 pb-1 sm:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, imageIndex) => {
            const active = imageIndex === index
            return (
              <motion.button
                key={imageIndex}
                onClick={() => {
                  setDirection(imageIndex > index ? 1 : -1)
                  setIndex(imageIndex)
                }}
                whileHover={{ y: -2 }}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border transition-all ${
                  active
                    ? 'border-[#D4AF37] shadow-[0_0_0_1px_rgba(212,175,55,0.4),0_8px_20px_rgba(212,175,55,0.15)]'
                    : 'border-white/12 opacity-55 hover:opacity-100'
                }`}
                aria-label={`Go to image ${imageIndex + 1}`}
                aria-current={active ? 'true' : undefined}
              >
                <img src={image.src} alt="" className="h-full w-full object-cover" draggable={false} loading="lazy" />
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <FullscreenViewer
            src={images[index].src}
            alt={images[index].alt}
            onClose={() => setFullscreen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
