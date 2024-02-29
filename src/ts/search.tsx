interface pageData {
    content:string,
    name:string,
    permalink:string,
    publishTimestamp:string,
    title:string

}


/**
 * Escape HTML tags as HTML entities
 * Edited from:
 * @link https://stackoverflow.com/a/5499821
 */
const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '…': '&hellip;'
};

function replaceTag(tag: string | number) {
    // @ts-ignore
    return tagsToReplace[tag] || tag;
}

class Search {
    // @ts-ignore
    private form: HTMLFormElement;
    private input: HTMLInputElement;
    private list: HTMLDivElement;
    private resultTitle: HTMLHeadElement;
    private resultTitleTemplate: string;

    // @ts-ignore
    constructor({ form, input, list, resultTitle, resultTitleTemplate }) {
        this.form = form;
        this.input = input;
        this.list = list;
        this.resultTitle = resultTitle;
        this.resultTitleTemplate = resultTitleTemplate;

        this.handleQueryString();
        this.bindQueryStringChange();
        this.bindSearchForm();
    }

    private async searchKeywords(keywords: string[]) {
        let results: pageData[] = [];
        let processingTimeMillis: number = 0;
        let keyword = keywords.join('')
        keyword = keyword.replace(/[&<>"…]/g, replaceTag);
        try {
            const searchUrl: string = `/apis/api.halo.run/v1alpha1/indices/post?keyword=${keyword}&highlightPreTag=%3Cmark%3E&highlightPostTag=%3C/mark%3E`;

            const res = await fetch(searchUrl);
            const data = await res.json();
            results = data.hits
            processingTimeMillis = data.processingTimeMillis

            return { results, processingTimeMillis };
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    private async doSearch(keywords: string[]) {
        const results = await this.searchKeywords(keywords);
        this.clear();
        const items:pageData[] | undefined = results?.results

        // @ts-ignore
        for (const item of items) {
            this.list.append(Search.render(item));
        }

        // @ts-ignore
        this.resultTitle.innerText = this.generateResultTitle(items?.length, ((results?.processingTimeMillis) / 1000).toPrecision(1));
    }

    private generateResultTitle(resultLen: string | number | undefined, time: string) {
        // @ts-ignore
        return this.resultTitleTemplate.replace("#PAGES_COUNT", resultLen).replace("#TIME_SECONDS", time);
    }

    private bindSearchForm() {
        let lastSearch = '';

        // @ts-ignore
        const eventHandler = (e) => {
            e.preventDefault();
            const keywords = this.input.value.trim();

            Search.updateQueryString(keywords, true);

            if (keywords === '') {
                lastSearch = '';
                return this.clear();
            }

            if (lastSearch === keywords) return;
            lastSearch = keywords;

            this.doSearch(keywords.split(' '));
        }

        this.input.addEventListener('input', eventHandler);
        this.input.addEventListener('compositionend', eventHandler);
    }

    private clear() {
        this.list.innerHTML = '';
        this.resultTitle.innerText = '';
    }

    private bindQueryStringChange() {
        window.addEventListener('popstate', () => {
            this.handleQueryString()
        })
    }

    private handleQueryString() {
        const pageURL = new URL(window.location.toString());
        const keywords = pageURL.searchParams.get('keyword');
        // @ts-ignore
        this.input.value = keywords;

        if (keywords) {
            this.doSearch(keywords.split(' '));
        }
        else {
            this.clear()
        }
    }

    private static updateQueryString(keywords: string, replaceState = false) {
        const pageURL = new URL(window.location.toString());

        if (keywords === '') {
            pageURL.searchParams.delete('keyword')
        }
        else {
            pageURL.searchParams.set('keyword', keywords);
        }

        if (replaceState) {
            window.history.replaceState('', '', pageURL.toString());
        }
        else {
            window.history.pushState('', '', pageURL.toString());
        }
    }


    public static render(item:pageData) {
        const article = document.createElement('article');
        const link = document.createElement('a');
        link.href = item.permalink;

        const details = document.createElement('div');
        details.className = 'article-details';

        const title = document.createElement('h2');
        title.className = 'article-title';
        title.innerHTML = item.title;

        const preview = document.createElement('section');
        preview.className = 'article-preview';
        preview.innerHTML = item.content;

        details.appendChild(title);
        details.appendChild(preview);

        link.appendChild(details);
        article.appendChild(link);

        return article;
    }
}

declare global {
    interface Window {
        searchResultTitleTemplate: string;
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        const searchForm = document.querySelector('.search-form') as HTMLFormElement,
            searchInput = searchForm.querySelector('input') as HTMLInputElement,
            searchResultList = document.querySelector('.search-result--list') as HTMLDivElement,
            searchResultTitle = document.querySelector('.search-result--title') as HTMLHeadingElement;

        new Search({
            form: searchForm,
            input: searchInput,
            list: searchResultList,
            resultTitle: searchResultTitle,
            resultTitleTemplate: window.searchResultTitleTemplate
        });
    }, 0);
})

export default Search;