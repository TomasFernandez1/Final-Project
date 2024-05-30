document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCreateProduct');
    const thumbnailInput = document.getElementById('thumbnail');
    const imagePreview = document.getElementById('imagePreview');
  
    thumbnailInput.addEventListener('change', handleImagePreview);
    form.addEventListener('submit', handleSubmit);
  
    function handleImagePreview() {
      const file = thumbnailInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
      }
    }
  
    async function handleSubmit(event) {
      event.preventDefault(); // Prevent the default form submission
  
      const formData = new FormData(form);
  
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData
        });
  
        const data = await response.json();
  
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: data.payload,
            html: '<b>Redirecting to the products page...</b>',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.location.replace('/api/products');
          }, 2000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem creating the product.'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem creating the product.'
        });
      }
    }
  });
  