/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import "./styles/style.scss";
// import StackGallery from "./ts/gallery";
import { getColor } from './ts/color';
import menu from './ts/menu';
import createElement from './ts/createElement';
import StackColorScheme from './ts/colorScheme';
// import { setupScrollspy } from './ts/scrollspy';
import { setupSmoothAnchors } from "./ts/smoothAnchors";
import * as tocbot from 'tocbot';

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            // new StackGallery(articleContent);
            setupSmoothAnchors();
            // setupScrollspy();
        }



        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img')!,
                            imageURL = image.src,
                            key = image.getAttribute('data-key')||'',
                            hash = image.getAttribute('data-hash')||'',
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details')!;

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }



        /**
         * Add copy button to code block
        */
        const preTags = document.querySelectorAll('pre')
        preTags.forEach(preTag => {
            // 创建一个新的 div 元素
            const divWrapper = document.createElement('div');
            // 添加类名为 'highlight' 的 CSS 类
            divWrapper.classList.add('highlight');
            // 将 <pre> 标签的内容移动到新创建的 div 元素中
            // @ts-ignore
            preTag.parentNode.insertBefore(divWrapper, preTag);
            divWrapper.appendChild(preTag);
        });

        const highlights = document.querySelectorAll('.article-content div.highlight,.item-html .highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[class*="language-"]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent!)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle')!);
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})
function generateSidebar(){
    const articleContent = document.querySelector('.article-content')
    if(!articleContent){
        return
    }
    const sideContainer = document.querySelector('.right-sidebar')
    if(!sideContainer?.childElementCount || sideContainer?.childElementCount === 0){
        return;

    }
    const titles = articleContent?.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (!titles || titles.length === 0) {
        const tocContainer = document.querySelector(".post_toc");
        tocContainer?.remove();
        const sideContainer = document.querySelector('.right-sidebar')
        if (!sideContainer?.childElementCount || sideContainer?.childElementCount === 0){
            sideContainer?.remove()
        }
        return;
    }
    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '#TableOfContents',
        // Where to grab the headings to build the table of contents.
        contentSelector: '.article-content',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h1, h2, h3, h4, h5, h6',
        activeLinkClass: 'active-class',
        activeListItemClass: 'active-class',
        headingsOffset: 40,
        scrollSmoothOffset: -40,

        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,

    });

}
generateSidebar()


declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;