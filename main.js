const apiUrl = 'https://jsonplaceholder.typicode.com/comments';

let commentsData = [];

const getData = async (src) => {
  try {
    const response = await fetch(src);
    const parseRes = await response.json();
    return parseRes;
  } catch (error) {
    console.log(error);
  }
}

const createCommentTable = comments => {
  let table = document.createElement('table');
  table.innerHTML = `
 
   <thead>
    <tr>
  <th>Id</th>
  <th>Name</th>
  <th>Email</th>
  <th>Body</th>
  <th>Action</th>
  </tr>
   </thead>
   <tbody id='comments-body'>
   </tbody>
    <ul id="pagination" class="pagination-sm"></ul>
  `;
  document.querySelector('.table-sec').appendChild(table);

  addComments(comments);
  return comments;
}

const deleteComment = (index) =>{
  commentsData.splice(index, 1);
  console.log('Komentarz usunięty')
  addComments(commentsData);  
}

const addDeleteToBtn = () => {
  const deleteBtns = document.querySelectorAll('button');
  for (btn of deleteBtns) {
    const index = btn.dataset.commentindex;
    btn.addEventListener("click", () => deleteComment(index));
    
  }
}

const addComments = comments => {
  document.querySelector('#comments-body').innerHTML = '';
  [...comments].map((comment, index) => {
    let commentRow = document.createElement('tr');
    commentRow.innerHTML = `<td>${index+1}</td><td>${comment.name}</td> <td>${comment.email}</td><td>${comment.body}</td><td><button class='btn btn--delete' data-commentIndex='${index}'>Usuń</button></td>`;
    document.querySelector('.table-sec tbody').appendChild(commentRow);
  })
  addDeleteToBtn();
}

const filerInput = document.getElementById('search');
const cenzorshipComments = document.getElementById('censorship');

const search = e => {
  const searchText = e.target.value;
  const findComments = [];
  commentsData.forEach(item => {
    if (item.body.includes(searchText) || item.name.includes(searchText) || item.email.includes(searchText)) findComments.push(item);
  })
  if(findComments.length>0) addComments(findComments);
}


const censorComments = (e) => {
  console.log(e.target.value);
  if (e.target.value ==='on') {
    const badWord = 'qu';
    const allRow = document.querySelectorAll('#comments-body>tr');
    allRow.forEach(row => {
      if (row.innerText.includes(badWord)) row.classList.toggle('censur');
    })
  }
}

filerInput.addEventListener('input', search);
cenzorshipComments.addEventListener('change', censorComments);



getData(apiUrl)
  .then(res => createCommentTable(res))
  .then(res => commentsData = res)


