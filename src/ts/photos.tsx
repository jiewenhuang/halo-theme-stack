
type HTMLElementWithPosition = HTMLElement & {
    style: {
        top: string;
        left: string;
        position: string;
    };
};

class Waterfall {
    // @ts-ignore
    private static currentPage: number = Number(document.querySelector('.gallery-photos').getAttribute('data-page') || 1)+1;
    private static isLoading: boolean = false;
    // @ts-ignore
    private static totalPage = Number(document.querySelector('.gallery-photos').getAttribute('data-total-page')) || 1;

    // 防抖函数
    private static debounce(func: Function, wait: number) {
        let timeout: number | undefined;
        return (...args: any) => {
            const context = this;
            const later = () => {
                timeout = undefined;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
        };
    }

    private static getMargin(side: string, element: HTMLElement): number {
        const style = window.getComputedStyle(element);
        // @ts-ignore
        return parseFloat(style[`margin${side}`]) || 0;
    }

    private static toPx(value: number): string {
        return `${value}px`;
    }

    private static getTop(element: HTMLElementWithPosition): number {
        return parseFloat(element.style.top);
    }

    private static getLeft(element: HTMLElementWithPosition): number {
        return parseFloat(element.style.left);
    }

    private static getClientWidth(element: HTMLElement): number {
        return element.clientWidth;
    }

    private static getClientHeight(element: HTMLElement): number {
        return element.clientHeight;
    }

    private static getBottom(element: HTMLElementWithPosition): number {
        return this.getTop(element) + this.getClientHeight(element) + this.getMargin("Bottom", element);
    }

    private static getRight(element: HTMLElementWithPosition): number {
        return this.getLeft(element) + this.getClientWidth(element) + this.getMargin("Right", element);
    }

    private static sortElements(elements: HTMLElementWithPosition[]): void {
        elements.sort((a, b) => {
            return this.getBottom(a) === this.getBottom(b) ? this.getLeft(b) - this.getLeft(a) : this.getBottom(b) - this.getBottom(a);
        });
    }

    private static resizeListener = (container: HTMLElement, initialWidth: number) => {
        return function (this: HTMLElement, event: Event) {
            if (this.clientWidth !== initialWidth) {
                // @ts-ignore
                event.target.removeEventListener(event.type, arguments.callee);
                Waterfall.applyLayout(container);
            }
        };
    };

    public static applyLayout(container: HTMLElement | string): void {
        if (typeof container === "string") {
            container = document.querySelector(container) as HTMLElement;
        }

        // @ts-ignore
        const elements: HTMLElementWithPosition[] = [].map.call(container.children, (element: HTMLElement) => {
            element.style.position = "absolute";
            return element as HTMLElementWithPosition;
        });

        container.style.position = "relative";

        let positionedElements: HTMLElementWithPosition[] = [];
        if (elements.length) {
            elements[0].style.top = "0px";
            elements[0].style.left = this.toPx(this.getMargin("Left", elements[0]));
            positionedElements.push(elements[0]);
        }

        let n: number;
        for (n = 1; n < elements.length; n++) {
            const prevElement = elements[n - 1];
            const currElement = elements[n];
            const fitsNextTo = this.getRight(prevElement) + this.getClientWidth(currElement) <= this.getClientWidth(container);

            if (!fitsNextTo) break;

            currElement.style.top = prevElement.style.top;
            currElement.style.left = this.toPx(this.getRight(prevElement) + this.getMargin("Left", currElement));
            positionedElements.push(currElement);
        }

        for (; n < elements.length; n++) {
            this.sortElements(positionedElements);
            const currElement = elements[n];
            const lastPositionedElement = positionedElements.pop()!;
            currElement.style.top = this.toPx(this.getBottom(lastPositionedElement) + this.getMargin("Top", currElement));
            currElement.style.left = this.toPx(this.getLeft(lastPositionedElement));
            positionedElements.push(currElement);
        }

        this.sortElements(positionedElements);
        const tallestElement = positionedElements[0];
        container.style.height = this.toPx(this.getBottom(tallestElement) + this.getMargin("Bottom", tallestElement));
        const containerWidth = this.getClientWidth(container);

        if (window.addEventListener) {
            window.addEventListener("resize", this.resizeListener(container, containerWidth));
        } else {
            (document.body as any).onresize = this.resizeListener(container, containerWidth);
        }
    }
    // 加载下一页数据
    public static async loadNextPage(container: HTMLElement): Promise<void> {
        if (this.isLoading) return;
        if (this.currentPage > this.totalPage){
            document.querySelector('.loading')?.remove();
            return;
        }
        this.isLoading = true;

        // 发起请求获取数据
        const response = await fetch(`/photos/page/${this.currentPage}`);
        const responseText = await response.text(); // 获取响应文本

        // 使用DOMParser解析HTML字符串
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        const newElements = doc.querySelectorAll('.gallery-photo'); // 请根据实际情况调整选择器

        // 将新元素添加到现有容器中
        newElements.forEach(element => container.appendChild(element));

        // 重新应用懒加载并更新布局
        this.initLazyLoadAndLayout(container);
        this.currentPage++;
        if(this.currentPage > this.totalPage){
            document.querySelector('.loading')?.remove();

        }

        this.isLoading = false;
    }


    // 初始化懒加载和布局更新
    public static initLazyLoadAndLayout(container: HTMLElement | string): void {
        if (typeof container === 'string') {
            container = document.querySelector(container) as HTMLElement;
        }
        const images = container.querySelectorAll('img[data-src]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    img.src = img.getAttribute('data-src')!;
                    img.removeAttribute('data-src');
                    // @ts-ignore
                    img.parentElement.classList.add('visible');
                    observer.unobserve(img);
                    img.onload = this.debounce(() => this.applyLayout(container), 100); // 使用防抖更新布局
                }
            });
        }, { rootMargin: "50px 0px", threshold: 0.5 });

        images.forEach(img => observer.observe(img));
    }

    // 初始化滚动监听以加载更多数据
    public static initInfiniteScroll(containerSelector: string): void {
        const observerForLoading = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.loadNextPage(document.querySelector(containerSelector) as HTMLElement);
            }
        }, {
            threshold: 1
        });

        observerForLoading.observe(document.querySelector('.loading')!);
    }
}

window.addEventListener("load", () => {
    // 使用示例
    const containerSelector = '.gallery-photos';
    Waterfall.initLazyLoadAndLayout(containerSelector);
    Waterfall.initInfiniteScroll(containerSelector);
})

export default Waterfall;
