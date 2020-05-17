document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.querySelector('#burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const modalDialog = document.querySelector('.modal-dialog');
    const sendButton = document.querySelector('#send');

    let clientWidth = document.documentElement.clientWidth;

    //проверка ширины окна и отображение кнопки меню
    if(clientWidth < 768) {
        burgerBtn.style.display = "flex";
    } else {  
        burgerBtn.style.display = "none";
    }

   //кнопка меню при изменении размера окна
    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        
        if(clientWidth < 768) {
            burgerBtn.style.display = "flex";
        } else {
            burgerBtn.style.display = "none";
        }
    });
    
    //open test при нажатии на кнопку меню
    burgerBtn.addEventListener('click', function() {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    });

    //анимация модального окна
    let count = -100;
    modalDialog.style.top = count + "%";
    const animateModal = () => {
        modalDialog.style.top = count + "%";
        count += 3;
       if(count < 0) {
            requestAnimationFrame(animateModal);
       } else {
           count = -100;
       }
    };

    //open test
    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        playTest();
    });

    //close test
    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block')
        burgerBtn.classList.remove('active');
    });

     //close test по клику мимо
    document.addEventListener('click', function(event) {
        if(
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')
        ) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });

    //вопросы теста
    const questions = [
        {
            question: "Какого цвета бургер?",
            answers: [
                {
                    title: 'Стандарт',
                    url: './image/burger.png'
                },
                {
                    title: 'Черный',
                    url: './image/burgerBlack.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Из какого мяса котлета?",
            answers: [
                {
                    title: 'Курица',
                    url: './image/chickenMeat.png'
                },
                {
                    title: 'Говядина',
                    url: './image/beefMeat.png'
                },
                {
                    title: 'Свинина',
                    url: './image/porkMeat.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Дополнительные ингредиенты?",
            answers: [
                {
                    title: 'Помидор',
                    url: './image/tomato.png'
                },
                {
                    title: 'Огурец',
                    url: './image/cucumber.png'
                },
                {
                    title: 'Салат',
                    url: './image/salad.png'
                },
                {
                    title: 'Лук',
                    url: './image/onion.png'
                }
            ],
            type: 'checkbox'
        },
        {
            question: "Добавить соус?",
            answers: [
                {
                    title: 'Чесночный',
                    url: './image/sauce1.png'
                },
                {
                    title: 'Томатный',
                    url: './image/sauce2.png'
                },
                {
                    title: 'Горчичный',
                    url: './image/sauce3.png'
                }
            ],
            type: 'radio'
        }
    ];

    //play test 
    const playTest = () => {
       
        const finalAnswers = []; //ответы пользователя

        let numberQuestion = 0;
        //создание ответов
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="radio" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src=${answer.url} alt="burger">
                    <span>${answer.title}</span>
                </label>`;
                formAnswers.appendChild(answerItem);
            });
        }; 
        // вписывает инф-ю в блок с вопросами
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = ''; // обнуление конткнта 

            if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');

            }
            // кнопки неактивны 
            if(numberQuestion === 0) {
                prevButton.classList.add('d-none');
            }
            if(numberQuestion === questions.length) {
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                formAnswers.innerHTML = `
                <div class="form-group">
                <label for="numberPhone">Введите свой номер</label>
                <input type="phone" class="form-control" id="numberPhone">
                </div>
                `;
            }
            // убираем модальное окно после теста
            if(numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Спасибо за пройденный тест!'
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }

        }

        renderQuestions(numberQuestion);

        const checkAnswer = () => { // сохранение ответов
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')
            inputs.forEach((input, index) => {
               if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
               }

               if(numberQuestion === questions.length) {
                obj[`Номер телефона`] = input.value;
               }
            })

            finalAnswers.push(obj)
        }

        // кнопки вперед назад И отправить
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }
    };



});

     
