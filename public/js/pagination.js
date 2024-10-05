document.addEventListener("DOMContentLoaded", function () {
    const featureContent = document.getElementById('feature-content');
    const featureWrapper = document.getElementById('feature-content-wrapper');
    const featureItems = document.querySelectorAll('.feature-item');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const totalItems = featureItems.length;
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Get the container width dynamically
    let containerWidth = featureWrapper.offsetWidth;

    // Adjust the container width on resize
    window.addEventListener('resize', () => {
        containerWidth = featureWrapper.offsetWidth;
        switchFeature(currentIndex); // Recalculate positioning on resize
    });

    // Update active pagination button
    function updatePagination(newIndex) {
        document.querySelector('.pagination-btn.active').classList.remove('active');
        paginationBtns[newIndex].classList.add('active');
    }

    // Switch feature
    function switchFeature(newIndex) {
        currentIndex = newIndex;
        currentTranslate = -newIndex * containerWidth; // Use containerWidth instead of window width
        featureContent.style.transform = `translateX(${currentTranslate}px)`;
        updatePagination(newIndex);
    }

    // Start dragging (touch or mouse)
    featureContent.addEventListener('touchstart', touchStart);
    featureContent.addEventListener('touchend', touchEnd);
    featureContent.addEventListener('touchmove', touchMove);

    featureContent.addEventListener('mousedown', touchStart);
    featureContent.addEventListener('mouseup', touchEnd);
    featureContent.addEventListener('mousemove', touchMove);
    featureContent.addEventListener('mouseleave', touchEnd);

    // Touch or Mouse start event
    function touchStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        prevTranslate = currentTranslate;
        animationID = requestAnimationFrame(animation);
        featureContent.classList.add('grabbing');
    }

    // Touch or Mouse move event
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startX;
        }
    }

    // Touch or Mouse end event
    function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        featureContent.classList.remove('grabbing');

        const movedBy = currentTranslate - prevTranslate;

        // Threshold for swipe
        if (movedBy < -containerWidth / 4 && currentIndex < totalItems - 1) {
            switchFeature(currentIndex + 1);
        } else if (movedBy > containerWidth / 4 && currentIndex > 0) {
            switchFeature(currentIndex - 1);
        } else {
            switchFeature(currentIndex);
        }
    }

    // Get position based on touch or mouse
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Animation loop to follow dragging
    function animation() {
        featureContent.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    // Pagination button click handling
    paginationBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switchFeature(index);
        });
    });
});
