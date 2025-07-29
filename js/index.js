const apiKey = "ed17676d8dd94d9ba55a51209da6bfde";

const sources = {
    "economic-times": {
    newsApi: "the-economic-times",
    rss: "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
    website: "https://economictimes.indiatimes.com/"
    },
    "the-hindu": {
    newsApi: "",
    rss: "https://www.thehindu.com/news/national/feeder/default.rss",
    website: "https://www.thehindu.com/"
    },
    "news18": {
    newsApi: "",
    rss: "https://www.news18.com/rss/india.xml",
    website: "https://www.news18.com/"
    },
    "times-of-india": {
    newsApi: "the-times-of-india",
    rss: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    website: "https://timesofindia.indiatimes.com/"
    }
};


async function fetchNewsAPI(sourceId) {
    if (!sourceId) return [];
    try {
    const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=${sourceId}&apiKey=${apiKey}`
    );
    const data = await response.json();
    return (
        data.articles?.map((article) => ({
        title: article.title,
        url: article.url,
        image: article.urlToImage || "",
        })) || []
    );
    } catch (error) {
    console.error(`Error fetching NewsAPI (${sourceId}):`, error);
    return [];
    }
}


async function fetchRSSFeed(rssUrl) {
    if (!rssUrl) return [];
    try {
    const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );
    const data = await response.json();
    return (
        data.items?.map((item) => ({
        title: item.title,
        url: item.link,
        image: item.enclosure?.link || "", 
        })) || []
    );
    } catch (error) {
    console.error(`Error fetching RSS (${rssUrl}):`, error);
    return [];
    }
}

async function fetchAndDisplayNews(paperId, source) {
    const headlinesList = document.getElementById(`${paperId}-headlines`);
    if (!headlinesList) return;

    let articles = await fetchNewsAPI(source.newsApi);
    if (articles.length === 0) {
    articles = await fetchRSSFeed(source.rss);
    } 
    const firstFive = articles.slice(0, 6);

    headlinesList.innerHTML = "";
    firstFive.forEach((article) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
    headlinesList.appendChild(li);
    });

    return articles; 
}

let allArticles = {};


async function initializeNews() {
    const promises = Object.keys(sources).map(async (paperId) => {
    const articles = await fetchAndDisplayNews(paperId, sources[paperId]);
    allArticles[paperId] = articles;
    });
    await Promise.all(promises);
    document.querySelector(".newspaper").style.opacity = "1";
}


const modal = document.getElementById("newsModal");
const modalHeader = document.getElementById("modal-header");
const modalImage = document.getElementById("modal-image");
const modalList = document.getElementById("modal-list");
const visitSiteBtn = document.getElementById("visit-site-btn");
const closeBtn = document.querySelector(".modal-close");

function openModal(sourceKey) {
    const articles = allArticles[sourceKey] || [];
    if (articles.length === 0) {
    modalHeader.textContent = "No news available";
    modalImage.style.display = "none";
    modalList.innerHTML = "";
    visitSiteBtn.style.display = "none";
    } else {
    modalHeader.textContent = `All Headlines - ${sourceKey.replace(/-/g, " ").toUpperCase()}`;
    
    const firstImage = articles.find((a) => a.image && a.image !== "")?.image;
    if (firstImage) {
        modalImage.src = firstImage;
        modalImage.style.display = "block";
    } else {
        modalImage.style.display = "none";
    }

  
    modalList.innerHTML = "";
    articles.forEach((article) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        modalList.appendChild(li);
    });

    visitSiteBtn.style.display = "inline-block";
    visitSiteBtn.onclick = () => {
        window.open(sources[sourceKey].website, "_blank");
    };
    }
    modal.style.display = "block";
}


closeBtn.onclick = () => {
    modal.style.display = "none";
};


window.onclick = (event) => {
    if (event.target === modal) {
    modal.style.display = "none";
    }
};


document.addEventListener("DOMContentLoaded", () => {
    initializeNews();

    document.querySelectorAll(".open-popup-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const sourceKey = btn.getAttribute("data-source");
        openModal(sourceKey);
    });
    });
});

window.onload = async function () {
await initializeNews();

setTimeout(() => {
    document.getElementById('header').style.transform = 'translateY(-34vh)';
}, 500);

setTimeout(() => {
    document.querySelector('.newspaper').style.transform = 'translateY(0vh)';
}, 500);
};


document.getElementById('screenshot-btn').addEventListener('click', function () {
const modalContent = document.querySelector('.modal-content');

html2canvas(modalContent).then(canvas => {
    const link = document.createElement('a');
    link.download = 'news_screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
});


document.getElementById('download-headlines-btn').addEventListener('click', () => {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

let y = 10; 
const sources = ['economic-times', 'the-hindu', 'news18', 'times-of-india'];

sources.forEach(source => {
    const headlinesList = document.getElementById(`${source}-headlines`);
    if (headlinesList) {
   
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(source.replace(/-/g, ' ').toUpperCase(), 10, y);
    y += 7;

    const items = headlinesList.querySelectorAll('li');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    items.forEach((item, index) => {
        const text = item.innerText.trim();
        if (y > 280) {  
        doc.addPage();
        y = 10;
        }
        doc.text(`• ${text}`, 12, y);
        y += 6;
    });

    y += 8;
    }
});

doc.save('NewsSphere_Headlines.pdf');
});
