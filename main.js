const apiUrl = 'https://jsonplaceholder.typicode.com/comments';

class DataTable {
  constructor(src) {
    this.src = src;
    this.uploadData = [];
  }

  async getData() {
    try {
      const response = await fetch(this.src);
      const parseRes = await response.json();
      this.uploadData = await parseRes;
      
    } catch (e) {
      console.log(e);
    }
  }
  createCommentTable() {
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
    </tbody>`;
  
    document.querySelector('.table-sec').appendChild(table);
    this.addComments(this.uploadData);
  }

  addComments(comments) {
    document.querySelector('#comments-body').innerHTML = '';
    comments.map((comment, index) => {
      let commentRow = document.createElement('tr');
      commentRow.innerHTML = `<td>${index + 1}</td><td>${comment.name}</td> <td>${comment.email}</td><td>${comment.body}</td><td><button class='btn btn--delete' data-commentIndex='${index}'>Usuń</button></td>`;
      document.querySelector('.table-sec tbody').appendChild(commentRow);
    })
    this.addDeleteToBtn(this.uploadData);
  }

  deleteComment(index) {
    this.uploadData.splice(index, 1);
    console.log('Komentarz usunięty')
    this.addComments(this.uploadData);
  }

  addDeleteToBtn() {
    const deleteBtns = document.querySelectorAll('button');
    deleteBtns.forEach(btn => {
      const index = btn.dataset.commentindex;
      btn.addEventListener("click", () => this.deleteComment(index));
    })
  }

  renderContent() {
    this.getData()
    .then(()=>this.createCommentTable())
  }
}

class TableWithActions extends DataTable{
  constructor(src) {
    super(src)
  }

  search(e) {
    const searchText = e.target.value;
    const findComments = [];
    this.uploadData.forEach(item => {
      if (item.body.includes(searchText) || item.name.includes(searchText) || item.email.includes(searchText)) findComments.push(item);
    })
     if (findComments.length > 0) this.addComments(findComments);
    else document.querySelector('.table-sec tbody').innerHTML = ''
  }

  censorComments(e) {
    if (e.target.value === 'on') {
      const badWord = 'el';
      const allRow = document.querySelectorAll('#comments-body>tr');
      allRow.forEach(row => {
        if (row.innerText.toLowerCase().includes(badWord)) row.classList.toggle('censur');
      })
    }
  }
}


const commentsTable = new TableWithActions(apiUrl);
commentsTable.renderContent();


const filerInput = document.getElementById('search');
filerInput.addEventListener('input', (e) => commentsTable.search(e));

const cenzorshipComments = document.getElementById('censorship');
cenzorshipComments.addEventListener('change', (e) => commentsTable.censorComments(e));

