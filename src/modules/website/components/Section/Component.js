import React, { useEffect, useRef } from "react";
import "./component.css";

const VideoComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // iOS Safari block kare to ignore
        });
      }
    };

    // 1) Scroll ke liye (IntersectionObserver)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              playVideo();
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 } // ✅ kam se kam 50% video visible hona chahiye
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // 2) Background → Foreground
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3) iPhone lock/unlock ke liye
    const handlePageShow = () => {
      playVideo();
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <div className="container-fluid Section">
      <div className="row">
        <div className="col-sm-12 myhgt">
          <video
            ref={videoRef}
            className="myVideo"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
          >
            <source src="img/hypertonicVideo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
