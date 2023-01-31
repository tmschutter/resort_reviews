const origin = window.location.origin

const reviewSubmitButton = document.querySelector('button.reviewSubmit')
const getReviewsButton = document.querySelector('button.getReviews')
const currentResort = document.querySelector('select.resorts')
const body = document.querySelector('body')
const reviewsContainer = document.querySelector('div.reviewsContainer')

async function populateDropdown(){
    const response = await fetch(`${origin}/resorts`)
    const data = await response.json()
    console.log(data);
    for (let resort of data){
        const { name, resort_id } = resort
        let opt = document.createElement('option')
        opt.value = resort_id
        opt.innerHTML = name
        currentResort.appendChild(opt)
    }
}
populateDropdown()

function populateReviews(data){
    for (let review of data){
        const { username, title, rating, review_id, content } = review

        let div = document.createElement('div')
        div.id = `review_id_${review_id}`

        let divTitle = document.createElement('div')
        divTitle.innerHTML = title

        let divUsername = document.createElement('div')
        divUsername.innerHTML = username

        let divRating = document.createElement('div')
        divRating.innerHTML = rating

        let divContent = document.createElement('div')
        divContent.innerHTML = `<p>${content}</p>`

        div.appendChild(divTitle)
        div.appendChild(divUsername)
        div.appendChild(divRating)
        div.appendChild(divContent)

        reviewsContainer.appendChild(div)
    }
}

getReviewsButton.addEventListener('click', async ()=>{
    const { value: id } = currentResort
    const response = await fetch(`${origin}/reviews/${id}`)
    const data = await response.json()
    console.log(data);
    populateReviews(data)
})

reviewSubmitButton.addEventListener('click', async () =>{
    const title = document.querySelector('#title')
    const username = document.querySelector('#username')
    const rating = document.querySelector('#rating')
    const content = document.querySelector('#content')
    const id = currentResort.value

    const response = await fetch(`${origin}/reviews/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'title': title.value, 'username': username.value, 'rating': rating.value, 'content': content.value}) 
    })
    const data = await response.json()
    console.log(data);
})

