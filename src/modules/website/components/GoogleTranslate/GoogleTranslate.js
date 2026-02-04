import React, { useEffect } from 'react';
import './GoogleTranslate.css';

const GoogleTranslate = () => {
    useEffect(() => {
        // Define the callback function for Google Translate
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,hi,es,fr,de,pt,it,ja,ru,zh-CN',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element_hidden' // Changed ID to indicate it's hidden
                );
            }
        };

        // Inject the script if not present
        const scriptId = 'google-translate-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }

        // MutationObserver to aggressively hide the top banner frame if it appears
        const observer = new MutationObserver((mutations) => {
            const banner = document.querySelector('.goog-te-banner-frame');
            if (banner) {
                banner.style.display = 'none';
                document.body.style.top = '0px';
            }
            // Also hide tooltip
            const tooltip = document.querySelector('.goog-te-balloon-frame');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    return (
        <div id="google_translate_element_hidden" style={{ display: 'none' }}></div>
    );
};

export default GoogleTranslate;

