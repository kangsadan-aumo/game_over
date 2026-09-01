document.addEventListener('DOMContentLoaded', () => {
    // Add a slight parallax effect to the cards on mouse move
    const cards = document.querySelectorAll('.game-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values based on mouse position relative to card center
            const xRotation = -((y - rect.height / 2) / rect.height * 10); // max 5 deg rotation
            const yRotation = (x - rect.width / 2) / rect.width * 10;
            
            card.style.transform = `translateY(-10px) scale(1.02) perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });
});
