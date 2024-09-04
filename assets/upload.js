document.addEventListener('DOMContentLoaded', () => {
  const uploadButton = document.querySelector('.upload-button');
  const fileInput = document.getElementById('file-input');
  const dropArea = document.querySelector('.drop-area');
  const uploadElement = document.querySelector('.upload-element');
  const sectionB = document.getElementById('carousel_3e3a');
  const retryButton = document.getElementById('retryButton');
  const canvas = document.getElementById('hiddenCanvas');
  const ctx = canvas.getContext('2d');
  const loadingSpinner = document.getElementById('loadingSpinner');
  let imgComparisonSlider;
  let stylesSelect = "";
  const text = document.getElementById('processingText');
  const feedbackSection = document.getElementById('feedbackSection');
  let processed_image = "";
  const sectionStyles = document.getElementById('sec-ff73');
  document.getElementById('negativeFeedbackInput').value = "";
  // Trigger file input click on upload button click
  uploadButton.addEventListener('click', () => {
    fileInput.click();
  });

  // File input change event
  fileInput.addEventListener('change', (event) => {
    handleFile(event.target.files[0]);
  });

  // Drag and drop events
  dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('dragging');
    uploadElement.classList.add('blurred');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragging');
    uploadElement.classList.remove('blurred');
  });

  dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('dragging');
    uploadElement.classList.remove('blurred');
    handleFile(event.dataTransfer.files[0]);
  });

    // Handle file processing
    function handleFile(file) {
        if (file) {
            toggleSectionB();
            const img = new Image();
            img.src = URL.createObjectURL(file); // Create a URL for the file
            sectionStyles.style.minHeight = '100vh';

            img.onload = () => {
                imageData = scaleImageToBase64(img);
                
            };

            img.onerror = (error) => {
                console.error('Error loading image:', error);
            };
        }
    }

    function resetUI() {
/*      // Hide the image section
      imageSection.style.display = 'none';
      
      // Clear the canvas
      const ctx = hiddenCanvas.getContext('2d');
      ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
      
      // Hide the buttons
      downloadButton.style.display = 'none';
      retryButton.style.display = 'none';
      
      // Show the drop area
      dropArea.style.display = 'block';*/
        location.reload();
    }

    retryButton.addEventListener('click', resetUI);

    // Function to scale the image and convert it to Base64
    function scaleImageToBase64(imageElement) {
        const maxSize = 1100; // Maximum width or height
        const scaleRatio = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight);

        // Create a canvas to draw the scaled image
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.naturalWidth * scaleRatio;
        canvas.height = imageElement.naturalHeight * scaleRatio;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to Base64
        return canvas.toDataURL('image/jpeg', 1); // Optionally adjust quality
    }

  // Toggle visibility of Section B
  function toggleSectionB() {
    if (sectionB.style.display === 'none' || sectionB.style.display === '') {
      sectionB.style.display = 'block';
    } else {
      sectionB.style.display = 'none';
    }
  }

  // Handle style selection (if you still want to keep this part, ensure there's a corresponding HTML)
  document.querySelectorAll('.style-option').forEach(button => {
    button.addEventListener('click', function() {
      const selectedStyle = this.getAttribute('data-style');
      alert('You selected: ' + selectedStyle);
      // Handle the selected style here
    });
  });

  // Function to convert an image file to a base64 string
  function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Ensure the base64 string has the correct prefix
                resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
        });
    }
    function startImageProcessing() {
      
      
      loadingSpinner.style.display = 'block';
      
      setTimeout(() => {
        text.textContent = 'Fixing abnormalities, this may take a few more seconds than usual...';
      }, 20000);

      // Your image processing code here...
    }   


  document.body.addEventListener('click', function(event) {
    // Check if the clicked element is one of the targets
    if (event.target.id === '90anime' 
        || event.target.id === 'catgirl'
        || event.target.id === 'creepy'
        || event.target.id === 'pixel'
        || event.target.id === 'dream'
        || event.target.id === 'trippy'
        || event.target.id === 'heat'
        || event.target.id === 'ghibli' ) {
      stylesSelect = event.target.id;
      console.log(stylesSelect);
      dropArea.style.display = 'none';
      sectionStyles.style.removeProperty('min-height');
      toggleSectionB();
      loadingSpinner.style.display = 'block';
      canvas.style.display = 'none';
      postData(imageData,"",stylesSelect)
      startImageProcessing();
    }
  });



    function renderImage(oldBase64Image, newImageBase64) {
        // Get the image section container
        const imageSection = document.getElementById("imageSection");

        // If the slider already exists, remove it before creating a new one
        if (imgComparisonSlider) {
            console.log("Removing existing img-comparison-slider...");
            imgComparisonSlider.remove(); // Remove the existing slider
        }

        // Create the img-comparison-slider element
        imgComparisonSlider = document.createElement("img-comparison-slider");
        imgComparisonSlider.setAttribute("tabindex", "0");
        imgComparisonSlider.setAttribute("class", "rendered");
        imgComparisonSlider.setAttribute("value", "35");

        // Create the first image element for the old image
        const oldImage = document.createElement("img");
        oldImage.setAttribute("slot", "first");
        oldImage.style.height = "auto";
        oldImage.style.width = "100%";
        oldImage.src = oldBase64Image; // Set the old base64 image source

        // Create the second image element for the new image
        const newImage = document.createElement("img");
        newImage.setAttribute("slot", "second");
        newImage.style.height = "auto";
        newImage.style.width = "100%";
        newImage.src = 'data:image/png;base64,' + newImageBase64; // Set the new processed image source

        // Append the images to the slider
        imgComparisonSlider.appendChild(oldImage);
        imgComparisonSlider.appendChild(newImage);

        // Insert the slider at the beginning of the image section
        imageSection.insertBefore(imgComparisonSlider, imageSection.firstChild);

        // Show the comparison slider
        imgComparisonSlider.style.display = "block"; // Show the comparison slider
    }

    // Function to remove the img-comparison-slider from the imageSection
    function removeImageComparisonSlider() {
        if (imgComparisonSlider) {
            console.log("Removing img-comparison-slider...");
            imgComparisonSlider.remove(); // Remove the slider from the DOM
            imgComparisonSlider = null; // Clear the reference
        } else {
            console.log("No img-comparison-slider to remove.");
        }
    }


    function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // Add event listener to the download button
    document.getElementById('downloadButton').addEventListener('click', () => {
        // Check if processed_image is available and is a base64 string
        if (processed_image && typeof processed_image === 'string') {
            // Remove the data URL prefix if it exists
            const base64Data = processed_image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            
            // Determine the content type (default to png if not specified)
            const contentType = processed_image.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
            
            // Call the download function
            downloadBase64File(contentType, base64Data, 'processed-image.png');
        } else {
            console.error('No valid image data available for download');
        }
    });

    function postData(imageData, negativeFeedback="",styleData) {
      fetch('https://api.cartoonifyai.me/image', {    
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          caption: negativeFeedback,
          style: styleData,
        }),
      })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        downloadButton.style.display = 'inline-block';
        retryButton.style.display = 'inline-block';
        feedbackSection.style.display = 'block';

        // Assuming the server returns the processed image data as base64 in the 'image' field
        if (data.image) {
          processed_image = data.image
          renderImage(imageData,processed_image);
        } else {
          console.error('No image data received from server');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Hide loading spinner in case of error
        loadingSpinner.style.display = 'none';
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
      });
    }

    // Function to check if canvas is visible
    function isCanvasVisible() {
      return canvas.style.display === 'block';
    }

    // Function to toggle canvas visibility
    function toggleCanvasVisibility() {
      if (isCanvasVisible()) {
        canvas.style.display = 'none';
      } else {
        canvas.style.display = 'block';
      }
    }

    // Add event listeners for thumbs up and thumbs down buttons
    document.getElementById('thumbsUpButton').addEventListener('click', () => {
      document.getElementById('feedbackMessage').textContent = 'Thank you for your positive feedback! 👍';
    });

    document.getElementById('thumbsDownButton').addEventListener('click', () => {
      document.getElementById('feedbackMessage').textContent = 'Sorry to hear that! You can try to provide what was missing or describe the image and try again.';
      // Show the negative feedback section
      document.getElementById('negativeFeedbackSection').style.display = 'block';
    });

    // Add event listener for the regenerate image button
    document.getElementById('regenerateImageButton').addEventListener('click', () => {
      const negativeFeedback = document.getElementById('negativeFeedbackInput').value;
      console.log('Regenerate image with feedback:', negativeFeedback);
      removeImageComparisonSlider();
      loadingSpinner.style.display = 'block';
      canvas.style.display = 'none';
      text.textContent = 'Processing Image with feedback...';
      postData(imageData,negativeFeedback, stylesSelect)
      startImageProcessing();

    });
});

//adding test
