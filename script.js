'use strict'
const api_key ='382c0ccbced536380a65a74f88777d7d';

const imgBaseUrl = 'http://image.tmdb.org/t/p/';

const fetchDataFormServer = async (url , callbackFunction , optionalParam) => {
    const respone = await fetch(url);

    const data = await respone.json()

    await callbackFunction(data)
} 
const homeUI = document.querySelector('#homeUI')
const genreUI = document.querySelector('#genresUI')
const body = document.querySelector('body')
const header = document.querySelector('header')
const genreTitle = document.querySelector('.genresTitle')


const changelibaryUI = () => {
    genreUI.style.display ='block'
    homeUI.style.display = 'none'
    body.classList.add('detailBody');
    header.classList.add('headerGenresUI')
}

const changeHomeUI = () => {
    genreUI.style.display ='none'
    homeUI.style.display = 'block'
    body.classList.remove('detailBody');
    header.classList.remove('headerGenresUI')
}


const genreList = {};
// fetch data to genre
fetchDataFormServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,async({genres}) => {
    for (const {id,name} of genres) {
        
        genreList[id] = name;
        const html = `
        <li><a onclick="fetchDataByGenre(${id},'${genreList[id]}')" href="#">${genreList[id]}</a></li>
        `
        document.querySelector('.ani-menu').insertAdjacentHTML("beforeend",html)
        
        
    }
})
// fetch data to Popular
fetchDataFormServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}`,async(movielist) => {  
    const movies = await movielist.results;
    
    movies.forEach((movies,index) => {
       

        
        const html =`
        <a href="#" onclick="changeDisplayMovieUI(${movies.id})" class="card">
                    <img src="${imgBaseUrl}w1280${movies.poster_path}" alt="">
                </a>
        `

        document.querySelector('.cards').insertAdjacentHTML("beforeend",html);
   
       
    })
    
    const cardList = document.querySelector('.cards')
  
    /// drag to slide
    let isDrag = false, prevPageX, prevScrollLeft;

    const dragStart = (e) => {
        isDrag = true;
        prevPageX = e.pageX; //1
        prevScrollLeft = cardList.scrollLeft; // 1
        cardList.classList.remove('smoothScroll')
    }

    const dragging = (e) => {
        if(!isDrag) return;
        e.preventDefault();
        let positionDiff = e.pageX - prevPageX // 
        cardList.scrollLeft = prevScrollLeft - positionDiff; // 
        
    }
    
    const dragStop = (e) => {
        isDrag = false;
        cardList.classList.add('smoothScroll');
    }

    cardList.addEventListener("mousedown", dragStart)
    cardList.addEventListener("mousemove", dragging)
    cardList.addEventListener("mouseup", dragStop)
   
    /// use arrow to slide

    let firstImg = cardList.querySelectorAll('.card')[0]
    let firstImgWidth = firstImg.clientWidth + 10;
   
    const arrowIcons = document.querySelectorAll("section .cardSlider i")

    arrowIcons.forEach(icon => { 
        icon.addEventListener("click",() => {
            cardList.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        })
    })

    /// auto slide
    
    var autoslide = setInterval(() => {
        if (isDrag) return
        if(cardList.scrollLeft >= 1600) return cardList.scrollLeft = 0;
        cardList.scrollLeft += firstImgWidth
        }, 1000);
    
    
})


// change display detail home UI
const changeDisplayMovieUI = async (id) => {
    await fetchDataFormServer(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${api_key}`,(videos) => {
        const result =  videos.results;
        const trailer = result.filter(video => video.type.includes("Trailer"));
        const video = document.querySelector(".video");
        video.src =`https://www.youtube.com/embed/${trailer[0].key}?autoplay=1&mute=1&loop=1&playlist=${trailer[0].key}`
         
    })
    // fetch info
    await fetchDataFormServer(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${api_key}`,(movie) => {
        document.querySelector('#tittle').textContent = `${movie.title}`;
        document.querySelector('.content p').textContent =`${movie.overview}`;
        document.querySelector('.content .details h6').textContent = `${movie.production_companies[0].name}`;
        document.querySelector('.content .details #gen').textContent = `${movie.genres[0].name}`
        document.querySelector('.content .details h4').textContent =`${movie.release_date.slice(0,4)}`
        document.querySelector('.content .details li').textContent =`${movie.vote_average.toFixed(1)}`

    })
    changeHomeUI();
    document.querySelector('.search').style.display ='none';
    search_field.value = '';

}

// Search UI
const search_field = document.querySelector('#search_field')
// search Enter UI
search_field.addEventListener("keypress", function(event) {
    if (search_field.value.length < 4) return
    if (event.key === "Enter")
    

    fetchDataFormServer(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${search_field.value}`,data => {
        const movies = data.results;
        document.querySelector('.cardLibary').innerHTML ='';
        movies.forEach(movie => {
            const html = `
            <a onclick="changeDisplayMovieUI(${movie.id})"class = "detailCard" href="#">
                <img src="${imgBaseUrl}w1280${movie.poster_path}" alt="">
                <div><ul>${movie.title}</ul></div>
            </a>
            `

            document.querySelector('.cardLibary').insertAdjacentHTML("beforeend",html)
        })
        changelibaryUI()
        genresMenu.scrollIntoView({ behavior: "smooth"})
        genreTitle.textContent = `Result for '${search_field.value}'`
        search_field.value ='';
        document.querySelector('.search').style.display = 'none'
    })
    page_a.forEach(page => {
       
        page.addEventListener('click',()=> {
            page_a.forEach(page => {
                page.style.textDecoration ='none';
                page.style.color ='#fff';
            })

            page.style.textDecoration ='underline';
            page.style.color ='#400000';

            const pageID = page.getAttribute('idpage')
            fetchDataFormServer(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${search_field.value}&page=${pageID}`,data => {
                const movies = data.results;
                document.querySelector('.cardLibary').innerHTML ='';
                movies.forEach(movie => {
                    const html = `
                    <a onclick="changeDisplayMovieUI(${movie.id})"class = "detailCard" href="#">
                        <img src="${imgBaseUrl}w1280${movie.poster_path}" alt="">
                        <div><ul>${movie.title}</ul></div>
                    </a>
                    `
        
                    document.querySelector('.cardLibary').insertAdjacentHTML("beforeend",html)
                    genresMenu.scrollIntoView({ behavior: "smooth"})
                })
            })
        })
        

    })
        
});
// search onkey UI
search_field.onkeyup = () => {
    
    if (search_field.value.length < 4) return document.querySelector('.search').style.display = 'none';

    document.querySelector('.search').style.display = 'block';

    fetchDataFormServer(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${search_field.value}`,(movie) => {
        const movies = movie.results;
        document.querySelector(".search").innerHTML = '';
        movies.forEach((movie,i) => {
            if(i > 6) return;
            let html = `
            <a href="#" onclick="changeDisplayMovieUI(${movie.id})" class ="content_Card">
                        
                <img src="${imgBaseUrl}w1280${movie.poster_path}" alt="">
                        
                <div>
                    <h3>${movie.title}</h3>
                                
                    <p> ${movie.release_date.slice(0,4)} <span>IMDB</span><i class="fa-solid fa-star">${movie.vote_average.toFixed(1)}</i></span></p>
                </div>
            </a>
            `
            document.querySelector(".search").insertAdjacentHTML("beforeend",html)
           
        })

    })

    
}



// Animation of Genres Row ///////////////////////////
const genresMenu = document.querySelector('.ani-menu')
const genreBtn = document.querySelector('.genres')
genreBtn.addEventListener('click',() => {
    if (genresMenu.classList.contains('translateX100')) genresMenu.classList.remove('translateX100');
    genresMenu.scrollIntoView({ behavior: "smooth"});
})

genresMenu.addEventListener('click',() => {
    genresMenu.classList.add('translateX100')
})
genresMenu.onmouseleave = () => {
    genresMenu.classList.add('translateX100')
}

const pageList = document.querySelector('.pagenavigation')
const pageItem = document.querySelector('.pagenavigation .pageItem')
const page_a = document.querySelectorAll('.pagenavigation .page-a')
const page_aa = document.querySelector('.pagenavigation .page-a')

/// fetch data by genre and change to libary UI
const fetchDataByGenre = async(idGenre,name) => {
    genreTitle.textContent = `${name}`;
    page_a[0].style.color ='#400000';
    page_a[0].style.textDecoration ='underline';

    
    await fetchDataFormServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${idGenre}`,(data) => {
        
        const movies = data.results;
        document.querySelector('.cardLibary').innerHTML ='';
        movies.forEach(movie => {
            const html = `
            <a onclick="changeDisplayMovieUI(${movie.id})"class = "detailCard" href="#">
                <img src="${imgBaseUrl}w1280${movie.poster_path}" alt="">
                <div><ul>${movie.title}</ul></div>
            </a>
            `

            document.querySelector('.cardLibary').insertAdjacentHTML("beforeend",html)
        })
        changelibaryUI()
        genresMenu.scrollIntoView({ behavior: "smooth"})

    })
// Page navigation
    await page_a.forEach(page => {
       
        page.addEventListener('click',()=> {
            page_a.forEach(page => {
                page.style.textDecoration ='none';
                page.style.color ='#fff';
            })

            page.style.textDecoration ='underline';
            page.style.color ='#400000';

            const pageID = page.getAttribute('idpage')
            fetchDataFormServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${idGenre}&page=${pageID}`,data => {
                const movies = data.results;
                document.querySelector('.cardLibary').innerHTML ='';
                movies.forEach(movie => {
                    const html = `
                    <a onclick="changeDisplayMovieUI(${movie.id})"class = "detailCard" href="#">
                        <img src="${imgBaseUrl}w1280${movie.poster_path}" alt="">
                        <div><ul>${movie.title}</ul></div>
                    </a>
                    `
        
                    document.querySelector('.cardLibary').insertAdjacentHTML("beforeend",html)
                    genresMenu.scrollIntoView({ behavior: "smooth"})
                })
            })
        })
        

    })

}
