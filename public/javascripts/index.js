$(document).ready(function () {
	getComments();
});

function getComments() {
	axios
		.get('/getComments')
		.then(( res ) => {
			let row = res.data;
			console.log(row);
			for ( let i in row ) {
				let name = row[i].name;
				let comment = row[i].comment;

				let commentList = `
                    <div class="card">
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                                <p>${ comment }</p>
                                <footer class="blockquote-footer">${ name }</footer>
                            </blockquote>
                        </div>
                    </div>
                `;
				$('#commentList').append(commentList);
			}
		})
		.catch(( error ) => {
			console.error('Error fetching comments:', error);
		});
}


function save_comment() {
	let name = $('#name').val();
	let comment = $('#comment').val();

	axios
		.post('/uploads', {
			name : name,
			comment : comment,
		})
		.then(() => {
			window.location.reload();
		})
		.catch(( error ) => {
			console.error('Error posting comment:', error);
			if ( error.response.status === 400 ) {
				alert(error.response.data.message);
			}
		});
}