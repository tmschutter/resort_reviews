const reviewSubmitButton = document.querySelector('button.reviewSubmit')
const getReviewsButton = document.querySelector('button.getReviews')
const currentResort = document.querySelector('select.resorts')

async function populateDropdown(){
    const response = await fetch('http://localhost:8000/resorts')
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

getReviewsButton.addEventListener('click', async ()=>{
    const { value: id } = currentResort
    const response = await fetch(`http://localhost:8000/reviews/${id}`)
    const data = await response.json()
    console.log(data);
})

reviewSubmitButton.addEventListener('click', async () =>{
    const title = document.querySelector('#title')
    const username = document.querySelector('#username')
    const rating = document.querySelector('#rating')
    const content = document.querySelector('#content')
    const id = currentResort.value

    const response = await fetch(`http://localhost:8000/reviews/${id}`, {
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