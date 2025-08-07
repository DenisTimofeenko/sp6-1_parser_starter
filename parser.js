// @todo: напишите здесь код парсера

function parsePage() {
  // МЕТА ДАННЫЕ
  const meta = {
    title: document.querySelector("title").textContent.split("—")[0].trim(),
    language: document.querySelector("html").lang,
    description: document.querySelector('meta[name="description"]').content,
    keywords: document
      .querySelector('meta[name="keywords"]')
      .content.split(",")
      .map((keyword) => keyword.trim()),
    opengraph: {},
  }
  const ogMetaTags = document.querySelectorAll("meta[property^='og:']")
  ogMetaTags.forEach((tag) => {
    const property = tag.getAttribute("property")
    const key = property.split(":")[1]
    const value = tag.getAttribute("content").split("—")[0].trim()
    meta.opengraph[key] = value
  })

  //ТОВАРЫ
  const productSection = document.querySelector(".product")
  const priceElement = productSection.querySelector(".price")
  const mainPriceText = priceElement.firstChild.nodeValue.trim()
  const oldPrice = document.querySelector(".price span").textContent
  const container = document.querySelector(".description")
  //   container.querySelector('h3').classList.remove('unused');
  const h3Element = document.querySelector(".description h3")
  h3Element.removeAttribute("class")
  const descriptionOne = container.innerHTML

  // Или получаем чистый текст

  //new code is upper

  let currency = ""
  if (priceElement.textContent.includes("₽")) {
    currency = "RUB"
  } else if (priceElement.textContent.includes("$")) {
    currency = "USD"
  }
  const product = {
    id: productSection.getAttribute("data-id"),
    name: productSection.querySelector("h1").textContent,
    isLiked: productSection.querySelector(".like").classList.contains("active"),
    tags: {},
    price: parseInt(mainPriceText.replace(/[^\d]/g, ""), 10),
    oldPrice: parseInt(oldPrice.replace(/[^\d]/g, ""), 10),
    discount:
      oldPrice.replace(/[^\d]/g, "") - mainPriceText.replace(/[^\d]/g, ""),
    discountPercent:
      (
        ((oldPrice.replace(/[^\d]/g, "") -
          mainPriceText.replace(/[^\d]/g, "")) /
          oldPrice.replace(/[^\d]/g, "")) *
        100
      ).toFixed(2) + "%",
    currency: currency,
    properties: {},
    description: descriptionOne.trim(),
    images: [],
  }

  product.tags = {
    category: [document.querySelector(".green").textContent],
    discount: [document.querySelector(".red").textContent],
    label: [document.querySelector(".blue").textContent],
  }

  const images = []
  const buttons = productSection.querySelectorAll("nav button")
  buttons.forEach((button) => {
    const img = button.querySelector("img")
    const preview = img.src
    const full = img.dataset.src
    const alt = img.alt
    images.push({
      preview,
      full,
      alt,
    })
  })

  product.images = images

  const propertiesList = productSection.querySelector(".properties")
  const propertiesItems = propertiesList.querySelectorAll("li")
  propertiesItems.forEach((item) => {
    const keySpan = item.querySelector(":nth-child(1)")
    const valueSpan = item.querySelector(":nth-child(2)")
    const key = keySpan.textContent.trim()
    const value = valueSpan.textContent.trim()
    product.properties[key] = value
  })

  // КАКИЕ-ТО САГГЕСТЕД
  const articles = document.querySelectorAll("section.suggested article")
  const suggested = []

  articles.forEach((article) => {
    let currency = ""
    if (article.querySelector("b").textContent.includes("₽")) {
      currency = "RUB"
    }
    const item = {
      name: document.querySelector("section.suggested article h3").textContent,
      description: document.querySelector("section.suggested article p")
        .textContent,
      image: document
        .querySelector("section.suggested article img")
        .getAttribute("src"),
      price: document
        .querySelector("section.suggested article b")
        .textContent.replace(/[^\d]/g, ""),
      currency: currency,
    }
    suggested.push(item)
  })

  // ПРОСМОТРЫ ЛАЙКИ
  const reviewsSection = document.querySelector(".reviews")
  const cards = reviewsSection.querySelectorAll("article")
  const reviews = []
  cards.forEach((article) => {
    const review = {}
    const ratingSpans = article
      .querySelector(".rating")
      .querySelectorAll(".filled")
    review.rating = ratingSpans.length
    review.title = article.querySelector(".title").textContent.trim()
    review.description = article.querySelector("p").textContent.trim()
    const authorInfo = article.querySelector(".author")
    review.author = {
      avatar: authorInfo.querySelector("img").src,
      name: authorInfo.querySelector("span").textContent.trim(),
    }
    const date = authorInfo.querySelector("i").textContent.trim()
    review.date = date.replace(/\//g, ".")
    reviews.push(review)
  })

  return {
    meta: meta,
    product: product,
    suggested: suggested,
    reviews: reviews,
  }
}

window.parsePage = parsePage
