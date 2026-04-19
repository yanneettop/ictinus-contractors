import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function PortfolioGalleryModal({ images, title, onClose }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
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
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, onClose])

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
      <div className="absolute inset-0 bg-[#0D0A08]/92 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-4">
        <h3 id="portfolio-gallery-title" className="sr-only">
          {title} gallery
        </h3>

        <motion.button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-12 right-4 text-white/60 transition-colors hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close gallery"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <div
          className="relative w-full overflow-hidden rounded-[14px] bg-[#1C1714] shadow-2xl"
          style={{ aspectRatio: '16/10' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={index}
              src={images[index].src}
              alt={images[index].alt}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-contain"
              draggable={false}
            />
          </AnimatePresence>

          {[-1, 1].map((dir) => (
            <motion.button
              key={dir}
              onClick={() => go(dir)}
              className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 ${
                dir === -1 ? 'left-3' : 'right-3'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={dir === -1 ? 'Previous' : 'Next'}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={dir === -1 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                />
              </svg>
            </motion.button>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
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

        <p className="mt-3 font-['Source_Serif_4'] text-[0.8125rem] tracking-wide text-white/40">
          {title} - {images[index].label}
        </p>
      </div>
    </motion.div>
  )
}
