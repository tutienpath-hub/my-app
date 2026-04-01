import { useState, useEffect, useRef, useCallback } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const PUBLIC = process.env.PUBLIC_URL || "";

const FIRST = Array.from({ length: 15 }, (_, i) => i + 1).map((name, index) => ({
  id: index + 1,
  src: `${PUBLIC}/${name}.jpg`,
  actualSrc: `${PUBLIC}/${name}.jpg`,
  loaded: true,
  retryCount: 0,
}));

const SECOND = Array.from({ length: 15 }, (_, i) => i + 1).map((name, index) => ({
  id: index + 15,
  src: `${PUBLIC}/${name + 15}.jpg`,
  actualSrc: `${PUBLIC}/${name + 15}.jpg`,
  loaded: true,
  retryCount: 0,
}));

const PLACEHOLDER_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNlMGUwZTAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZDBkMGQwIi8+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4oCi4oCi4oCiPC90ZXh0Pjwvc3ZnPg==";

function getDaysLeft(targetDate) {
  const today = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
}

function updateCountdown(target) {
  const now = new Date();
  const targetDate = new Date(target);
  const diff = targetDate.getTime() - now.getTime();
  if (diff > 0) {
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
  return { hours: 0, minutes: 0, seconds: 0 };
}

// ── sub-components ────────────────────────────────────────────────────────────

function FallingFlowers({ flowers }) {
  return (
    <div className="falling-flowers">
      {flowers.map((flower, i) => (
        <img
          key={i}
          className="flower"
          style={{
            left: `${flower.left}%`,
            animationDuration: `${flower.duration}s`,
            animationDelay: `${flower.delay}s`,
          }}
          src={`${PUBLIC}/flower.png`}
          alt="flower"
        />
      ))}
    </div>
  );
}

function AudioControl({ isSpinning, onToggleSpin, onToggleAudio, audioRef }) {
  return (
    <div className="fixed top-4 right-4 z-50"
      style={{
        zIndex: 99,
        position: "absolute",
        right: 36,
        top: 24
      }}>
      <audio className="hidden" ref={audioRef} src={`${PUBLIC}/themeSong.mp3`} preload="none" loop />
      <svg
        viewBox="0 0 60 60"
        width="60"
        height="60"
        className={`circle-text-svg select-none${isSpinning ? " circle-text-spin" : ""}`}
      >
        <defs>
          <path
            id="circlePath"
            d="M 30, 30 m -24, 0 a 24,24 0 1,1 48,0 a 24,24 0 1,1 -48,0"
          />
        </defs>
        <text fontSize="5" fill="#b77b3b" fontFamily="cursive">
          <textPath href="#circlePath" startOffset="0%">
            Triết &amp; Yến • Triết &amp; Yến • Triết &amp; Yến • Triết &amp; Yến • Triết &amp; Yến •
          </textPath>
        </text>
      </svg>
      <button
        onClick={() => {
          onToggleSpin();
          onToggleAudio();
        }}
        className="rounded-full"
        style={{
          outline: "none", border: "none", background: "none", position: "absolute",
          top: 13, left: 15, width: 42, height: 42
        }}
      >
        <span className="material-icons py-1 text-4xl text-amber-700" style={{
          fontSize: 36,
          position: "absolute",
          top: 0,
          left: 0
        }}>
          {isSpinning ? <img
            key="playBtn"
            style={{
              width: 32,
              height: 32
            }}
            src={`${PUBLIC}/play-button.png`}
            alt="flower"
          /> : <img
            key="playBtn"
            style={{
              width: 32,
              height: 32
            }}
            src={`${PUBLIC}/stop-button.png`}
            alt="flower"
          />}
        </span>

      </button>
    </div>
  );
}

function HeroSection({ targetDate }) {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url('${PUBLIC}/29.jpg')`,
        backgroundSize: "100% auto",
        height: "140vh",
        marginTop: "-186px"
      }}
    >
      <div className="absolute top-24 w-full text-white" style={{ textAlign: "center" }}>
        <div className="flex flex-col items-center">
          <div
            style={{
              fontFamily: "var(--Hello-honey, cursive)",
              fontSize: "5rem",
              color: "#fff",
              paddingTop: 260
            }}
          >
            Triet <span style={{ fontSize: "2.5rem" }}>❤</span> Yen
          </div>
          <div style={{ fontSize: "3rem", color: "white" }}>28 . 04 . 2026</div>
          <div
            style={{
              fontFamily: "var(--ovo, serif)",
              fontSize: "1.5rem",
              color: "#fff",
              marginTop: "1rem",
              marginLeft: "48px"
            }}
          >
            {getDaysLeft(targetDate)} days left
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveTheDateSection() {
  const calendarDays = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 1, 2
  ];

  return (
    <div className="py-12" style={{ color: "var(--Primary, #b77b3b)", textAlign: "center" }}>
      <div className="flex flex-col items-center">
        <h1
          style={{
            fontFamily: "var(--andasia, cursive)",
            fontSize: "3rem",
            marginBottom: "1rem",
            marginTop: "0px"
          }}
        >
          Save The Date
        </h1>
        <div style={{ fontSize: "3rem" }}>11:00 - Thứ 3</div>
        <div
          className="shake"
          style={{ fontFamily: "var(--Hello-honey, cursive)", fontSize: "3.75rem" }}
        >
          28 . 04 . 2026
        </div>

        <div
          className="flex w-full flex-col items-center"
          style={{ fontFamily: "var(--ovo, serif)" }}
        >
          <div style={{ fontSize: "1.25rem", letterSpacing: "4px" }}>April</div>
          <div className="my-2 flex gap-4" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 150,
                borderTop: "2px solid",
                borderBottom: "2px solid",
                padding: "8px",
                letterSpacing: "4px",
                textAlign: "center",
              }}
            >
              TUESDAY
            </div>
            <div style={{ fontSize: "2.25rem" }}>28</div>
            <div
              style={{
                width: 150,
                borderTop: "2px solid",
                borderBottom: "2px solid",
                padding: "8px",
                letterSpacing: "4px",
                textAlign: "center",
              }}
            >
              AT 11:00 AM
            </div>
          </div>
          <div style={{ fontSize: "1.25rem", letterSpacing: "4px" }}>2026</div>
        </div>
      </div>

      {/* Mini Calendar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 1rem" }}>
        <div style={{ width: "100%", maxWidth: 320 }}>
          <ul className="list-none font-bold" style={{ padding: 0, margin: 0 }}>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <li
                key={d}
                style={{
                  display: "inline-block",
                  width: "14%",
                  padding: "4px 0",
                  textAlign: "center",
                }}
              >
                {d}
              </li>
            ))}
          </ul>
          <hr />
          <ul className="list-none" style={{ padding: 0, margin: 0 }}>
            {calendarDays.map((day) => (
              <li
                key={day}
                style={{
                  display: "inline-block",
                  width: "14%",
                  padding: "4px 0",
                  textAlign: "center",
                }}
              >
                {day === 28 ? (
                  <div
                    style={{
                      margin: "auto",
                      width: 27,
                      borderRadius: "50%",
                      backgroundColor: "black",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    28
                  </div>
                ) : (
                  day
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ margin: "1rem auto", width: "66%", border: "2px solid", opacity: 0.3 }} />

      {/* Location */}
      <LocationSection />
    </div>
  );
}

function LocationSection() {
  const openMap = () => {
    window.open(
      "https://www.google.com/maps/place/10%C2%B035'41.2%22N+106%C2%B038'02.6%22E/@10.5947035,106.6338898,87a,50.3y,1.38t/data=!3m1!1e3!4m4!3m3!8m2!3d10.59477!4d106.634057?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "var(--ovo, serif)" }}>
      <div style={{ fontSize: "2.25rem", padding: "0.5rem 0" }}>Tư Gia</div>
      <div style={{ padding: "0 1rem" }}>337 Tổ 12, Ấp Phước Kế, Xã Mỹ Lộc, Long An</div>
      <div className="my-6 flex justify-center" style={{ fontSize: "1.5rem", marginBottom: "26px", marginTop: "16px" }}>
        <div
          className="flex cursor-pointer items-center justify-center rounded-lg"
          style={{ border: "2px solid", padding: "0.75rem", gap: 8 }}
          onClick={openMap}
        >
          <span
            style={{
              WebkitBackgroundClip: "text",
              // WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              border: "1px",
              borderRadius: "99",
              textAlign: "center",
              alignItems:"center",
              width: "fit-content",
            }}
          >
            Vị Trí
          </span>
        </div>
      </div>
      <iframe
        style={{ display: "block", margin: "auto", border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m16!1m11!1m3!1d86.87211062361087!2d106.63388978410484!3d10.594703509358174!2m2!1f0!2f1.382153611658271!3m2!1i1024!2i768!4f50.315498097822406!3m2!1m1!2zMTDCsDM1JzQxLjIiTiAxMDbCsDM4JzAyLjYiRQ!5e1!3m2!1sen!2s!4v1774452460554!5m2!1sen!2s"
        width="350"
        height="300"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Wedding location map"
      />
    </div>
  );
}

function AlbumSection({ images, label, onOpenLightbox }) {
  return (
    <div className="relative" style={{ overflowX: "auto", overflowY: "hidden" }}>
      <div
        className="flex gap-2 p-2"
        style={{
          minWidth: "max-content",
          margin: "0 auto",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            style={{
              height: 256,
              width: "auto",
              flexShrink: 0,
              cursor: "pointer",
              borderRadius: 8,
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              opacity: image.loaded ? 1 : 0.3,
              filter: image.loaded ? "none" : "blur(4px)",
              transition: "all 0.5s",
            }}
            src={image.src || PLACEHOLDER_SRC}
            alt={`${label} wedding photo ${image.id}`}
            data-image-id={image.id}
            onClick={() => onOpenLightbox(image)}
          />
        ))}
      </div>
      <div
        className="shake"
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--ovo, serif)",
            fontSize: "0.75rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            color: "var(--Primary, #b77b3b)",
            opacity: 0.7,
          }}
        >
          Slide →
        </span>
      </div>
    </div>
  );
}

function Lightbox({ selectedImage, onClose }) {
  if (!selectedImage) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.9)",
      }}
      onClick={onClose}
    >
      <div
        style={{ position: "relative", maxHeight: "100%", maxWidth: "100%", padding: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            zIndex: 10,
            display: "flex",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "white",
            color: "black",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          onClick={onClose}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>
            close
          </span>
        </button>
        <img
          src={selectedImage.src}
          alt={`Wedding photo ${selectedImage.id}`}
          style={{
            maxHeight: "90vh",
            maxWidth: "90vw",
            borderRadius: 8,
            objectFit: "contain",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function WeddingMain() {
  const TARGET_DATE = "2026-04-28";

  const [isSpinning, setIsSpinning] = useState(true);
  const [countdown, setCountdown] = useState(updateCountdown(TARGET_DATE));
  const [beachImages, setBeachImages] = useState(FIRST);
  const [indoorImages, setIndoorImages] = useState(SECOND);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const audioRef = useRef(null);
  const intersectionObserverRef = useRef(null);

  const flowers = useRef(
    Array.from({ length: 20 }).map((_, i) => ({
      left: i * 10 + Math.random() * 5,
      duration: 5 + Math.random() * 3,
      delay: Math.random() * 5,
    }))
  ).current;

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => setCountdown(updateCountdown(TARGET_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  // Audio autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => setIsSpinning(false));
    }
  }, []);

  // Lightbox body scroll lock
  useEffect(() => {
    document.body.style.overflow = showLightbox ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showLightbox]);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.paused ? audio.play().catch(() => { }) : audio.pause();
    }
  }, []);

  const openLightbox = useCallback((image) => {
    setSelectedImage({ ...image, src: image.actualSrc || image.src });
    setShowLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
    setSelectedImage(null);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const imageId = parseInt(el.getAttribute("data-image-id") || "0");
            loadImage(imageId);
            observer.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.05 }
    );

    intersectionObserverRef.current = observer;

    setTimeout(() => {
      document.querySelectorAll("img[data-image-id]").forEach((el) => {
        const id = parseInt(el.getAttribute("data-image-id") || "0");
        const allImgs = [...FIRST, ...SECOND];
        const img = allImgs.find((i) => i.id === id);
        if (img && !img.loaded) observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadImage = (imageId) => {
    const allImages = [...FIRST, ...SECOND];
    const image = allImages.find((img) => img.id === imageId);
    if (!image || image.loaded) return;

    const img = new Image();
    img.onload = () => {
      const setter = imageId <= 15 ? setBeachImages : setIndoorImages;
      setter((prev) =>
        prev.map((i) => (i.id === imageId ? { ...i, src: i.actualSrc, loaded: true } : i))
      );
    };
    img.onerror = () => {
      if (!image.retryCount) {
        image.retryCount = 1;
        setTimeout(() => loadImage(imageId), 2000);
      } else {
        const setter = imageId <= 15 ? setBeachImages : setIndoorImages;
        setter((prev) => prev.map((i) => (i.id === imageId ? { ...i, loaded: true } : i)));
      }
    };
    img.src = image.actualSrc;
  };

  return (
    <>
      {/* Inline styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake { animation: shake 7s infinite; }

        @keyframes jump {
          0% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
          40% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
        .jump { animation: jump 0.8s infinite; }

        @keyframes openLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); display: none; }
        }
        .openLeft { animation: openLeft 1s forwards; }

        @keyframes openRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); display: none; }
        }
        .openRight { animation: openRight 1s forwards; }

        .falling-flowers {
          pointer-events: none;
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 1;
        }
        .flower {
          position: absolute;
          top: -60px;
          width: 40px; height: 40px;
          opacity: 0.8;
          animation: fall 6s linear infinite;
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg) scale(0.8); opacity: 0.2; }
        }

        .circle-text-spin {
          animation: spin 10s linear infinite;
          transform-origin: 50% 50%;
          display: block;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .circle-text-svg { pointer-events: none; }
      `}</style>

      {/* Envelope open animation */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <div
          className="openLeft"
          style={{
            position: "absolute",
            top: 0,
            zIndex: 2,
            height: "100vh",
            width: "50%",
            backgroundImage: `url('${PUBLIC}/letter-background.webp')`,
            backgroundSize: "cover",
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          }}
        />
        <div
          className="openRight"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1,
            height: "100vh",
            width: "66%",
            backgroundImage: `url('${PUBLIC}/letter-background.webp')`,
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* Audio control */}
      <AudioControl
        isSpinning={isSpinning}
        onToggleSpin={() => setIsSpinning((v) => !v)}
        onToggleAudio={toggleAudio}
        audioRef={audioRef}
      />

      {/* Falling flowers */}
      <FallingFlowers flowers={flowers} />

      {/* Main content */}
      <div
        style={{
          backgroundImage: `url('${PUBLIC}/veinstone.webp')`,
          backgroundSize: "cover",
          paddingBottom: "1rem",
          textAlign: "center",
          // marginTop: "-32px"
        }}
      >
        <HeroSection targetDate={TARGET_DATE} />
        <SaveTheDateSection />

        {/* Albums */}
        <section style={{ margin: "2rem 0", fontFamily: "var(--ovo, serif)" }}>
          <hr style={{ margin: "1rem auto", width: "66%", border: "2px solid var(--Primary, #b77b3b)", opacity: 0.3 }} />
          <div
            style={{
              textAlign: "center",
              fontSize: "2.25rem",
              marginBottom: "1rem",
              color: "var(--Primary, #b77b3b)",
            }}
          >
            Albums
          </div>
          <AlbumSection images={beachImages} label="Beach" onOpenLightbox={openLightbox} />
          <AlbumSection images={indoorImages} label="Indoor" onOpenLightbox={openLightbox} />
        </section>

        {/* Thank you */}
        <section style={{ textAlign: "center" }}>
          <div
            style={{
              margin: "2rem 0 0.5rem",
              fontFamily: "var(--thank-you, cursive)",
              fontSize: "3.75rem",
              color: "var(--Primary, #b77b3b)",
            }}
          >
            Thank you
          </div>
          <div
            style={{
              fontFamily: "var(--ovo, serif)",
              fontSize: "1.5rem",
              color: "var(--Primary, #b77b3b)",
            }}
          >
            for being a part of our special day!
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {showLightbox && <Lightbox selectedImage={selectedImage} onClose={closeLightbox} />}
    </>
  );
}