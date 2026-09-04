const textPaths = document.querySelectorAll('textPath');

            let position = 0;
            let velocity = 0;

            const MIN_POSITION = -17;
            const MAX_POSITION = 17;

            // Mouse wheel / trackpad
            window.addEventListener('wheel', (e) => {

                e.preventDefault();

                velocity += e.deltaY * 0.0018;

            }, { passive: false });

            // Touch (mobile / tablet) — swipe to rotate the menu
            let touchY = null;

            window.addEventListener('touchstart', (e) => {

                touchY = e.touches[0].clientY;

            }, { passive: true });

            window.addEventListener('touchmove', (e) => {

                if (touchY === null) return;

                const currentY = e.touches[0].clientY;
                const deltaY = touchY - currentY;

                velocity += deltaY * 0.045;
                touchY = currentY;

            }, { passive: true });

            window.addEventListener('touchend', () => {

                touchY = null;

            }, { passive: true });


            function animate() {

                // Move
                position += velocity;

                // Friction / inertia
                velocity *= 0.92 ;


                // Hard limits
                if (position < MIN_POSITION) {

                    position = MIN_POSITION;

                    if (velocity < 0) {
                        velocity = 0;
                    }

                }

                if (position > MAX_POSITION) {

                    position = MAX_POSITION;

                    if (velocity > 0) {
                        velocity = 0;
                    }

                }

                // Update menu items
                textPaths.forEach(path => {

                    const base =
                        Number(path.dataset.base);

                    path.setAttribute(
                        'startOffset',
                        `${base + position}%`
                    );

                });

                requestAnimationFrame(animate);
            }

            animate();