const origin = window.location.origin

const reviewSubmitButton = document.querySelector('button.reviewSubmit')
const getReviewsButton = document.querySelector('button.getReviews')
const currentResort = document.querySelector('select.resorts')
const body = document.querySelector('body')
const reviewsContainer = document.querySelector('div.reviewsContainer')
const newResortNav = document.querySelector('button.newResortNav')
const newResortSubmit = document.querySelector('button.newResortSubmit')
const resortForm = document.querySelector('form.newResort')
const reviewForm = document.querySelector('form.newReview')
const deleteResort = document.querySelector('button.deleteResort')

async function populateDropdown(){
    currentResort.replaceChildren()
    const response = await fetch(`${origin}/resorts`)
    const data = await response.json()
    console.log(data);
    for (let resort of data){
        const { name, resort_id, state } = resort
        let opt = document.createElement('option')
        opt.value = resort_id
        opt.innerHTML = `${name}, ${state}`
        currentResort.appendChild(opt)
    }
}
populateDropdown()

async function getReviews(){
    const { value: id } = currentResort
    const response = await fetch(`${origin}/reviews/${id}`)
    const data = await response.json()
    console.log(data);
    reviewsContainer.replaceChildren()
    populateReviews(data)
}

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

        let button = document.createElement('button')
        button.type = 'button'
        button.innerHTML = 'DELETE'
        button.addEventListener('click', ()=>{
            deleteReview(review_id)
        })

        div.appendChild(divTitle)
        div.appendChild(divUsername)
        div.appendChild(divRating)
        div.appendChild(divContent)
        div.appendChild(button)

        reviewsContainer.appendChild(div)
    }
}

async function deleteReview(id){
    const response = await fetch(`${origin}/reviews/${id}`, {method: 'DELETE'})
    const data = await response.json()
    console.log(data);
}

getReviewsButton.addEventListener('click', ()=>{
    reviewForm.style = ''
    getReviews()
})

reviewSubmitButton.addEventListener('click', async () =>{
    const title = document.querySelector('#title').value
    const username = document.querySelector('#username').value
    const rating = document.querySelector('#rating').value
    const content = document.querySelector('#content').value
    const id = currentResort.value

    const response = await fetch(`${origin}/reviews/${id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'title': title, 'username': username, 'rating': rating, 'content': content}) 
    })
    const data = await response.json()
    console.log(data);
    getReviews()
})

newResortNav.addEventListener('click', ()=>{
    resortForm.style = ''
    reviewForm.style = 'display: none;'
    reviewsContainer.replaceChildren()
})

newResortSubmit.addEventListener('click', async ()=>{
    const name = document.querySelector('#name').value
    const city = document.querySelector('#city').value
    const state = document.querySelector('#state').value

    const response = await fetch(`${origin}/resorts`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'name': name, 'city': city, 'state': state}) 
    })
    const data = await response.json()
    console.log(data);
    populateDropdown()
})

deleteResort.addEventListener('click', async ()=>{
    const id = currentResort.value

    const response = await fetch(`${origin}/resorts/${id}`, {method: 'DELETE'})
    const data = await response.json()
    console.log(data);
    populateDropdown()
})