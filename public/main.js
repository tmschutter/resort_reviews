const origin = window.location.origin

const reviewSubmitButton = document.querySelector('button.reviewSubmit')
const getReviewsButton = document.querySelector('button.getReviews')
const resortDropdown = document.querySelector('select.resorts')
const body = document.querySelector('body')
const reviewsContainer = document.querySelector('div.reviewsContainer')
const newResortNavShow = document.querySelector('button.newResortNavShow')
const newResortNavHide = document.querySelector('button.newResortNavHide')
const newResortSubmit = document.querySelector('button.newResortSubmit')
const resortForm = document.querySelector('div.newResort')
const reviewForm = document.querySelector('form.newReview')
const deleteResort = document.querySelector('button.deleteResort')
const reviewNavButtonShow = document.querySelector('button.reviewNavButtonShow')
const reviewNavButtonHide = document.querySelector('button.reviewNavButtonHide')
const reviewsContainerMain = document.querySelector('.reviewsContainerMain')
const bgfade = document.querySelector('div.bgfade')

async function populateDropdown(){
    resortDropdown.replaceChildren()
    const response = await fetch(`${origin}/resorts`)
    const data = await response.json()
    console.log(data);
    let optDefault = document.createElement('option')
    optDefault.value = 'default'
    optDefault.innerHTML = 'Resorts'
    resortDropdown.appendChild(optDefault)
    for (let resort of data){
        const { name, resort_id, state } = resort
        let opt = document.createElement('option')
        opt.value = resort_id
        opt.innerHTML = `${name}, ${state}`
        opt.addEventListener('click', getReviews)
        resortDropdown.appendChild(opt)
    }
}
populateDropdown()

async function getReviews(){
    const { value: id } = resortDropdown
    const response = await fetch(`${origin}/reviews/${id}`)
    const data = await response.json()
    console.log(data);
    reviewsContainerMain.style.display = 'block'
    reviewsContainer.replaceChildren()
    populateReviews(data)
}

function populateReviews(data){
    for (let review of data){
        const { username, title, rating, review_id, content } = review

        let div = document.createElement('div')
        div.id = `review_id_${review_id}`
        div.className = 'reviewBox'

        let divTitle = document.createElement('div')
        divTitle.className = 'reviewTitle'
        divTitle.innerHTML = `${title}<br><br>`
        
        let divRating = document.createElement('div')
        divRating.className = 'reviewRating'
        divRating.innerHTML = `${rating}/5<br><br>`
        
        let divContent = document.createElement('div')
        divContent.className = 'reviewContent'
        divContent.innerHTML = `<p>"${content}"</p><br>`

        let divUsername = document.createElement('div')
        divUsername.className = 'reviewName'
        divUsername.innerHTML = `-${username}<br><br>`
        
        let button = document.createElement('button')
        button.className = 'reviewDelete'
        button.type = 'button'
        button.innerHTML = 'DELETE'
        button.addEventListener('click', ()=>{
            deleteReview(review_id)
        })

        div.appendChild(divTitle)
        div.appendChild(divRating)
        div.appendChild(divContent)
        div.appendChild(divUsername)
        div.appendChild(button)

        reviewsContainer.appendChild(div)
    }
}

async function deleteReview(id){
    const response = await fetch(`${origin}/reviews/${id}`, {method: 'DELETE'})
    const data = await response.json()
    console.log(data);
}

reviewSubmitButton.addEventListener('click', async () =>{
    const title = document.querySelector('#title').value
    const username = document.querySelector('#username').value
    const rating = document.querySelector('#rating').value
    const content = document.querySelector('#content').value
    const id = resortDropdown.value

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
    reviewForm.style.display = 'none'
    getReviews()
})

newResortNavShow.addEventListener('click', ()=>{
    // newResortNavShow.style.display = 'none'
    // newResortNavHide.style.display = 'block'
    resortForm.style.display = 'block'
    bgfade.style.display = 'block'
})

newResortNavHide.addEventListener('click', ()=>{
    // newResortNavShow.style.display = 'block'
    // newResortNavHide.style.display = 'none'
    resortForm.style.display = 'none'
    bgfade.style.display = 'none'
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
    resortForm.style.display = 'none'
    newResortNavShow.style.display = 'block'
    newResortNavHide.style.display = 'none'
})

// deleteResort.addEventListener('click', async ()=>{
//     const id = resortDropdown.value

//     const response = await fetch(`${origin}/resorts/${id}`, {method: 'DELETE'})
//     const data = await response.json()
//     console.log(data);
//     populateDropdown()
// })

reviewNavButtonShow.addEventListener('click', ()=>{
    reviewForm.style.display = 'block'
    bgfade.style.display = 'block'
    // reviewNavButtonShow.style.display = 'none'
    // reviewNavButtonHide.style.display = 'block'
})

reviewNavButtonHide.addEventListener('click', ()=>{
    reviewForm.style.display = 'none'
    bgfade.style.display = 'none'
    // reviewNavButtonShow.style.display = 'block'
    // reviewNavButtonHide.style.display = 'none'
})