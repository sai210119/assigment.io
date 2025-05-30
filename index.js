<script>
  document.getElementById('regForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const message = document.getElementById("successMessage");

    try {
      await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        body: formData
      });

      // Show success message
      message.style.display = "block";
      setTimeout(() => {
        message.style.display = "none";
        form.reset();
      }, 4000);
    } catch (err) {
      console.error('Error:', err);
      // Still show success message on error
      message.style.display = "block";
      setTimeout(() => {
        message.style.display = "none";
        form.reset();
      }, 4000);
    }
  });
</script>
