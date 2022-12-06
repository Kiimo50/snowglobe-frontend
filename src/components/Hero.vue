<template>
    <section class="hero__wrapper" id="">
        <h1>Curio Snowglobes</h1>
        <h2 class="txt__subhead">Exclusive collectibles for Curio Card holders</h2>
        <p class="txt__body">Claim your free snowglobes:</p>

        <svg class="icon__arrows" width="24" height="38" viewBox="0 0 24 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1407_9464)">
            <path d="M16.59 8L12 12.58L7.41 8L6 9.41L12 15.41L18 9.41L16.59 8Z" fill="#2E2E2E"/>
            </g>
            <g clip-path="url(#clip1_1407_9464)">
            <path d="M16.59 15L12 19.58L7.41 15L6 16.41L12 22.41L18 16.41L16.59 15Z" fill="#2E2E2E"/>
            </g>
            <g clip-path="url(#clip2_1407_9464)">
            <path d="M16.59 22L12 26.58L7.41 22L6 23.41L12 29.41L18 23.41L16.59 22Z" fill="#2E2E2E"/>
            </g>
            <defs>
            <clipPath id="clip0_1407_9464">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            <clipPath id="clip1_1407_9464">
            <rect width="24" height="24" fill="white" transform="translate(0 7)"/>
            </clipPath>
            <clipPath id="clip2_1407_9464">
            <rect width="24" height="24" fill="white" transform="translate(0 14)"/>
            </clipPath>
            </defs>
        </svg>

    </section>
  </template>

  <<style scoped>
    .hero__wrapper {
        height: 100vh;
        border-bottom: var(--border);
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
        padding-left: 10vw;
        padding-right: 10vw;
    }

    .txt__subhead {
        margin-top: 6px;
        margin-bottom: 16px;
        max-width: 280px;
    }

    .txt__body {
        text-align: center;
    }

    .icon__arrows {
        position: absolute;
        bottom: 16px;
        animation: hideshow 1s ease infinite;
    }

    @keyframes hideshow {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    } 

    @media only screen and (min-width: 768px) {
        .hero__wrapper {
            padding-left: 24px;
            padding-right: 24px;
        }

        .icon__arrows {
            display: none;
        }
    }
  </style>