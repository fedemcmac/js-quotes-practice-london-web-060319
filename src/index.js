// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
window.addEventListener("DOMContentLoaded", () => {
    fetchQuotes("http://localhost:3000/quotes?_embed=likes");
    newQuote();
})

function fetchQuotes(url) {
    fetch(url)
    .then(resp => resp.json())
    .then(data => showQuotes(data));
}

function showQuotes(data) {
    data.forEach(function(quoteObj) {
        addQuoteToDom(quoteObj);
    })
}

const newQuoteForm = document.querySelector("form#new-quote-form");
function newQuote() {
    newQuoteForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const newQuote = event.target["new-quote"].value;
        const newAuthor = event.target["author"].value;
        submitNewQuote(newQuote, newAuthor);
    })
}

function submitNewQuote(quote, author) {
    formData = {
        quote: quote,
        author: author,
        likes: []
    }
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      };
      fetch("http://localhost:3000/quotes", configObj)
      .then(response => response.json())
      .then(data => addQuoteToDom(data))
}

function addQuoteToDom(quoteObj) {
    const quotesUl = document.querySelector("div ul#quote-list");
    const quoteLi = document.createElement("li");
        quoteLi.className = "quote-card";
        quotesUl.appendChild(quoteLi);

        quoteBlockQuote = document.createElement("blockquote");
        quoteBlockQuote.className = "blockquote";
        quoteLi.appendChild(quoteBlockQuote);

        quoteP = document.createElement("p");
        quoteP.className = "mb-0";
        quoteP.innerText = quoteObj.quote;
        quoteBlockQuote.appendChild(quoteP);
        
        quoteFooter = document.createElement("footer");
        quoteFooter.className = "blockquote-footer";
        quoteFooter.innerText = quoteObj.author;
        quoteBlockQuote.appendChild(quoteFooter);
        
        quoteBr = document.createElement("br");
        quoteBlockQuote.appendChild(quoteBr);
        
        quoteLikeBtn = document.createElement("button");
        quoteLikeBtn.className = "btn-success";
        quoteLikeBtn.id = `btn-${quoteObj.id}`;
        quoteLikeBtn.innerHTML = `Likes: <span>${quoteObj.likes.length}</span>`;
        quoteBlockQuote.appendChild(quoteLikeBtn);
        quoteLikeBtn.addEventListener("click", () => {addLike(quoteObj)})
        
        quoteDeleteBtn = document.createElement("button");
        quoteDeleteBtn.className = "btn-danger";
        quoteDeleteBtn.innerHTML = "Delete";
        quoteBlockQuote.appendChild(quoteDeleteBtn);
        quoteDeleteBtn.addEventListener("click", () => {
            fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                method: "DELETE"
            }).then(() => quoteLi.remove());
        });
    }

function addLike(quote) {   
    const likeData = {
        quoteId: quote.id
    }
    
    configObj = {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"    
        },
        body: JSON.stringify(likeData)
    };
    fetch("http://localhost:3000/likes", configObj)
    .then(resp => resp.json())
    .then(data => updateLikeToDom(data));
}

function updateLikeToDom(likeObj) {
    const likeBtn = document.querySelector(`button#btn-${likeObj.quoteId}`) 
    fetch(`http://localhost:3000/quotes/${likeObj.quoteId}?_embed=likes`)
    .then(resp => resp.json())
    .then(data => likeBtn.innerHTML = `Likes: <span>${data.likes.length}</span>`)
    
}