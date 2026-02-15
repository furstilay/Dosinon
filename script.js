
function scrollTo0vh() {
    window.scrollTo({
        top: 0, // היעד: גובה המסך הראשון
        left: 0,
        behavior: 'smooth' // גלילה חלקה
    });
}

function scrollTo100vh() {
    window.scrollTo({
        top: window.innerHeight, // היעד: גובה המסך הראשון
        left: 0,
        behavior: 'smooth' // גלילה חלקה
    });
}

function scrollTo200vh() {
    window.scrollTo({
        top: 2 * window.innerHeight, // היעד: גובה המסך הראשון
        left: 0,
        behavior: 'smooth' // גלילה חלקה
    });
}

function scrollTo300vh() {
    window.scrollTo({
        top: 3 * window.innerHeight, // היעד: גובה המסך הראשון
        left: 0,
        behavior: 'smooth' // גלילה חלקה
    });
}


const squaresButtons = document.querySelectorAll('.square');

squaresButtons.forEach(element => {
    element.addEventListener('click', (event) => {
        window.open('https://daf-yomi.com/dafYomi.aspx');
    });
});


// Recoms Mouse Escaping
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 600) {
        const cards = document.querySelectorAll('.recom');
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;

            // חישוב המרחק בין העכבר למרכז הכרטיס
            const angle = Math.atan2(cardY - mouseY, cardX - mouseX);
            const distance = Math.hypot(cardX - mouseX, cardY - mouseY);

            // טווח ההשפעה (כמה קרוב העכבר צריך להיות כדי שהכרטיס יברח)
            const proximity = 350; 

            if (distance < proximity) {
                // חישוב עוצמת הבריחה - ככל שהעכבר קרוב יותר, הבריחה חזקה יותר
                const force = (proximity - distance) / 10; 
                const moveX = Math.cos(angle) * force;
                const moveY = Math.sin(angle) * force;

                // הזזה של הכרטיס (שומר על ה-rotate הקיים שלך)
                const currentRotation = getComputedStyle(card).transform.includes('matrix') ? '' : ''; 
                // הערה: בגלל שיש לך rotate ב-CSS, נשתמש ב-translate
                card.style.transform = `translate(${moveX}px, ${moveY}px) ${card.classList.contains('one') ? 'rotate(5deg)' : card.classList.contains('two') ? 'rotate(-8deg)' : card.classList.contains('three') ? 'rotate(5deg)' : 'rotate(-3deg)'}`;
            } else {
                // החזרה למצב המקורי כשהעכבר מתרחק
                card.style.transform = '';
            }
        });
    }
});



// הגדרות הקנבס
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    // שליפת הצבעים הכתומים מה-CSS
    const style = getComputedStyle(document.documentElement);
    const orangeColor = style.getPropertyValue('--orange').trim() || 'rgb(190, 100, 50)';
    const lightOrange = style.getPropertyValue('--light-orange').trim() || 'rgb(203, 135, 98)';

    let stars = [];
    const numStars = 200; 
    let width, height;

    // התאמת גודל הקנבס למסך
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // מחלקת כוכב כתום
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            // מיקום רנדומלי בפרספקטיבה
            this.x = (Math.random() - 0.5) * width;
            this.y = (Math.random() - 0.5) * height;
            this.z = Math.random() * width;
            
            // בחירת צבע רנדומלית מתוך שני גוני הכתום שלך
            this.color = Math.random() > 0.5 ? orangeColor : lightOrange;
        }

        update() {
        
            let speed = 8;
            this.z -= speed; 
            
            if (this.z <= 0) {
                this.reset();
                this.z = width;
            }
        }

        draw() {
            // חישוב מיקום על המסך (סימולציית תלת-ממד)
            let sx = (this.x / this.z) * width + width / 2;
            let sy = (this.y / this.z) * height + height / 2;

            // הכוכב גדל ככל שהוא מתקרב (Z קטן)
            let r = (1 - this.z / width) * 4;

            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            
            // הגדרת הצבע והזוהר הכתום
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = orangeColor;
            
            ctx.fill();
        }
    }

    // יצירת הכוכבים
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }

    // פונקציית האנימציה
    function animate() {
        // ניקוי הקנבס לשקיפות כדי לראות את הרקע שמתחת
        ctx.clearRect(0, 0, width, height); 

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    // הפעלה
    animate();
});