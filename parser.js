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
    const value = tag.getAttribute("content")
    meta.opengraph[key] = value
  })

  //ТОВАРЫ
  const productSection = document.querySelector(".product")
  const priceElement = productSection.querySelector(".price")
  const mainPriceText = priceElement.firstChild.nodeValue.trim()
  const oldPrice = document.querySelector(".price span").textContent
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
    price: mainPriceText.replace(/[^\d]/g, ""),
    oldPrice: oldPrice.replace(/[^\d]/g, ""),
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
    description: productSection.querySelector(".description").textContent,
    images: [],
  }

  // см выше описание

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
    const item = {
      name: document.querySelector("section.suggested article h3").textContent,
      description: document.querySelector("section.suggested article p")
        .textContent,
      Image: document
        .querySelector("section.suggested article img")
        .getAttribute("src"),
      price: document.querySelector("section.suggested article b").textContent,
      currency: document.querySelector("section.suggested article b")
        .textContent,
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
    review.date = authorInfo.querySelector("i").textContent.trim()
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
