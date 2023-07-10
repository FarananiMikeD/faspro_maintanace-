
//This Template it's for the users who are signing up, Attendee, Event organizers, Exhibitors, Speakers
exports.updatePasswordTemplate = (user, displayMessage) => `


<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registered</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
            background-color: #ffffff;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-sizing: border-box;
            border-top: 20px solid #e5e5e5;
            box-shadow: 0 2px 8px rgba(138, 138, 138, 0.15);
            border-left: 20px solid #e5e5e5;
            border-right: 20px solid #e5e5e5;
            border-bottom: 20px solid #e5e5e5;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0;
            margin-bottom: 20px;
            padding: 0 10px;
            background-color: #26A958;
            color: #ffffff;
            border-radius: 3px
        }

        .header img {
            width: 80%;
        }

        .logo {
            display: flex;
            align-items: center;
        }

        .logo img {
            border-radius: 50%;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        }

        .content {
            margin-top: 0;
            margin-bottom: 20px;
            padding: 20px;
            border: 1px solid #ffffff;
            border-radius: 4px;
            background-color: #ffffff;
            text-align: center;
        }

        .content h2 {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: bold;
            text-align: center;
            color: #26A958;
        }

        .content p {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 18px;
            text-align: justify;
            line-height: 1.5;
            color: #7e7e7e !important;
        }

        .cta {
            text-align: center;
        }

        .cta a {
            display: inline-block;
            padding: 15px 25px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            background-color: #26A958;
            color: #ffffff;
            border-radius: 4px;
            border: none;
            transition: background-color 0.3s ease;
        }

        .cta a:hover {
            background-color: #d95000;
        }

        /* Button Styles */
        /* Button Styles */

        .nice-button {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            background-color: #26A958;
            color: #fff !important;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .nice-button:before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.3);
            transition: width 0.3s ease;
        }

        .nice-button:hover:before {
            width: 100%;
        }

        .nice-button:hover {
            background-color: #26A958;
        }

        .nice-button:active {
            background-color: #26A958;
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            margin-bottom: 0;
            padding: 20px;
            background-color: #26A958;
            color: #ffffff;
            font-size: 14px;
            height: 150px;
            border-radius: 3px
        }

        .footer p {
            margin: 0;
        }

        .footer a {
            color: #ffffff;
            text-decoration: none;
        }

        .domain__name {
            text-align: center;
        }

        @media only screen and (max-width: 600px) {
            .container {
                max-width: 100%;
                padding: 10px;
            }

            .header {
                padding: 10px;
            }

            .header h1 {
                font-size: 24px;
            }

            .header img {
                width: 100%;
            }

            .content {
                padding: 10px;
            }

            .cta a {
                padding: 10px 20px;
                font-size: 16px;
            }

            .footer {
                padding: 10px;
                height: auto
            }
        }
    </style>
</head>


<body>
    <div class="container">
        <div class="header">
            <img src="https://faspro24.com/wp-content/uploads/2023/05/faspro24_logo_white1.png" alt="">
        </div>
        <div class="content">
            <div style="margin-bottom: 20px;">

                <div class="img__container">
                    <img src="https://faspro24.com/wp-content/uploads/2023/05/faspro24_comfirm-your-email_illustration1.png"
                        alt="">
                </div>

                <p style="margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: bold; color: #26a958; text-align:center">
                    Dear ${user.firstName} ${user.firstName}
                </p>

                <h6 style="margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: bold; color: #26a958;">
             ${displayMessage}
                </h6>

                <a class="nice-button"
                    style="margin-top: 0; margin-bottom: 20px; font-size: 18px; font-weight: bold; color: #26a958;"
                    href=${process.env.FRONT_END_URL}/login> Click here to login
                </a>

            </div>
        </div>

        <div class=" footer">
            <p style=" margin-top: 0; margin-bottom: 20px; font-size: 16px; line-height: 1.5; ">If you have any
                questions or concerns, please contact our support team at
                <a href=mailto: ${process.env.EMAIL_SUPPORT}>${process.env.EMAIL_SUPPORT}</a>.
            </p>

            <p style=" margin-top: 0; font-size: 16px; line-height: 1.5; ">
                ${process.env.COPY_RIGHT} &copy; 2023. All rights reserved. | <a
                    href="https://faspro24.com/privacy-policy">Privacy Policy</a> | <a
                    href="https://faspro24.com/terms-and-conditions">Terms of Service</a>
            </p>

        </div>

    </div>
</body>

</html>

`
