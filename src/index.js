// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const QUOTE_LIKES_URL = "http://localhost:3000/quotes?_embed=likes"
const BASE_URL = "http://localhost:3000/quotes"
var quotesArr =[]

document.addEventListener("DOMContentLoaded", () => {
    //DOM elements
    const quoteList = document.querySelector("#quote-list")
    const form = document.querySelector("#new-quote-form")
    
    //event listeners
    form.addEventListener('submit', (e)=> {
        e.preventDefault()
        newQuote={
            quote: form.elements["new-quote"].value,
            author: form.elements["author"].value,
            likes: []
        }
        createQuote(newQuote)
    })
    quoteList.addEventListener('click', (e)=> {
        if(e.target.className === "btn-danger"){
            deleteQuote(e.target.dataset.id)
        }
        if(e.target.className === "btn-success"){
            addLike(parseInt(e.target.dataset.id))
        }
    })

    function quoteFetch(){ fetch(QUOTE_LIKES_URL)
        .then(r => r.json())
        .then(data => {
            quotesArr = data
            displayQuotes(quotesArr)
        })
    }
    quoteFetch();
    function createQuote(newQuote){
        fetch(BASE_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify(newQuote)
        }).then(r => r.json())
        .then(newQuote => {
            quotesArr.push(newQuote)
            return displayQuotes(quotesArr)
        })
        
    }

    function deleteQuote(id){
       fetch(`${BASE_URL}/${id}`, {
           method: "DELETE"
       }).then(function(){
           quotesArr.splice(quotesArr.indexOf(quote => quote.id == id), 1)
            return displayQuotes(quotesArr)
       })
       
       
    }

    function addLike(id){
        fetch("http://localhost:3000/likes", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify({quoteId: parseInt(id)})  
        }).then(r => r.json())
        .then(data => {
           updateIndex = quotesArr.findIndex(quote => quote.id == id)
           
           quotesArr[updateIndex].likes.push(data)
           return displayQuotes(quotesArr)
        })
    }



    function displayQuotes(quotes) {
        quoteList.innerHTML = quotes.map(quote => {
            return `
             <li class='quote-card'>
                <blockquote class="blockquote">
                  <p class="mb-0">${quote.quote}</p>
                  <footer class="blockquote-footer">${quote.author}</footer>
                  <br>
                  <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                  <button data-id=${quote.id} class='btn-danger'>Delete</button>
                 </blockquote>
             </li>
             `
        }).join("")
    }
})