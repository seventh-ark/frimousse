import Script from "next/script";

export function AnimatedFavicon() {
  return (
    <>
      <link href="/icon-1.svg" id="favicon" rel="icon" />
      <Script id="favicon-animation">
        {`
          const favicons = ['/icon-1.svg', '/icon-2.svg', '/icon-3.svg'];
          let currentIndex = 0;

          function updateFavicon() {
            currentIndex = (currentIndex + 1) % favicons.length;
            document.getElementById('favicon').href = favicons[currentIndex];
          }

          setInterval(updateFavicon, 400);
        `}
      </Script>
    </>
  );
}
