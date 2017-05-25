
$(document).ready(()=>{

	// All api calls go to this link
	const apiBaseUrl = 'http://api.themoviedb.org/3';
	// All images use this link
	const imageBaseUrl = 'http://image.tmdb.org/t/p/';

	const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

	var buttonsHTML = '';
	for (let i = 0; i < genreArray.length; i++){
		buttonsHTML += `<button class="btn btn-primary genre-button">${genreArray[i].name}</button>`
	}
	$('#genre-buttons').html(buttonsHTML);

	$.getJSON(nowPlayingUrl, (nowPlayingData)=>{
		var currentlyPlayingHTML = getHTML(nowPlayingData);
		$('#movie-grid').html(currentlyPlayingHTML);
		$('.movie-poster').click(function() {
			// console.log(this)
			var thisMovieId = $(this).attr('movie-id');
			var thisMovieUrl = `${apiBaseUrl}/movie/${thisMovieId}?api_key=${apiKey}`;
			$.getJSON(thisMovieUrl,(thisMovieData)=>{
				console.log(thisMovieData);
				var bodyData = modalBodyHTML(thisMovieData);
				$('#myModalLabel').html(thisMovieData.title);
				$('.modal-body').html(bodyData);
				$('#myModal').modal();
			});
		});

		$grid = $('#movie-grid').isotope({
			itemSelector: '.movie-poster'
		});
		$('.genre-button').click(function(){
			$grid.isotope({
				filter: `.${this.innerText}`
			})
		})
		$('#all').click(function(){
			$grid.isotope({
				filter: ''
			})
		});

	});

	$('#movie-form').submit((event)=>{
		event.preventDefault();
		var userInput = encodeURI($('#search-input').val());
		$('serach-input').val('');
		var searchUrl = `${apiBaseUrl}/search/movie?query=${userInput}&api_key=${apiKey}`;
		$.getJSON(searchUrl,(searchMovieData)=>{
			var searchMovieHTML = getHTML(searchMovieData);
			$('#movie-grid').html(searchMovieHTML);
		});
	});

	function getHTML(data){

		var newHTML = '';
		for (let i = 0; i < data.results.length; i++){
			var movieId = data.results[i].id;
			var thisMovieGenre = data.results[i].genre_ids;
			var movieGenreClassList = ' ';
			for (let j = 0; j < genreArray.length; j++){
				if (thisMovieGenre.indexOf(genreArray[j].id) > -1){
					movieGenreClassList += genreArray[j].name + ' ';
				}
			}
			// console.log(nowPlayingData.results[i].poster_path);
			var posterUrl = `${imageBaseUrl}w300${data.results[i].poster_path}`;
			newHTML += `<div class="col-sm-6 col-md-2 images movie-poster ${movieGenreClassList}" movie-id='${movieId}'>`;
				newHTML += `<img src='${posterUrl}'>`;
			newHTML += `</div>`;
		}
		return newHTML;
	}

	function modalBodyHTML(data){
		var modHTML = '';
		var backDropUrl = `${imageBaseUrl}w780${data.backdrop_path}`;
		modHTML += `<img src='${backDropUrl}'>`;
		modHTML += `</br>`;
		modHTML += `<div class="release-date col-sm-12">${data.release_date}</div>`;
		modHTML += `</br>`;
		modHTML += `<div class="overview col-sm-12">${data.overview}</div>`;
		return modHTML;
	}

});
























