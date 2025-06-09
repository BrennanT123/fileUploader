const openUploadBtn = document.querySelector("#uploadFile");
const closeUploadBtn = document.querySelector("#closeModal");
const uploadModal = document.querySelector("#modal");

openUploadBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  uploadModal.style.display = "flex";
});

closeUploadBtn?.addEventListener("click", () => {
  uploadModal.style.display = "none";
});


const openFolderBtn = document.querySelector("#addFolder");
const closeFolderBtn = document.querySelector("#closeFolderModal");
const folderModal = document.querySelector("#folderModal");

openFolderBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  folderModal.style.display = "flex";
  console.log('click');
});

closeFolderBtn?.addEventListener("click", () => {
  folderModal.style.display = "none";
});
