const fs = require('fs');

async function test() {
  const formData = new FormData();
  const fileData = fs.readFileSync('test_cv.pdf');
  const pdfBlob = new Blob([fileData], { type: 'application/pdf' });
  formData.append('cv', pdfBlob, 'test_cv.pdf');
  formData.append('jobDescription', 'Software Engineer');
  formData.append('userId', 'demo-user');

  try {
    const res = await fetch('http://localhost:5000/api/generate/cv', {
      method: 'POST',
      body: formData
    });
    const data = await res.text();
    console.log(res.status, data);
  } catch (err) {
    console.error(err);
  }
}

test();
