# CS361-Assignment-6

Microservice README

This README provides clear instructions on how to programmatically interact with the microservice implemented in this project.
Table of Contents

    1. Introduction
    2. Requesting Data
        2.1 Example Request
    3. Receiving Data
    4. UML Sequence Diagram

1. Introduction

This microservice allows you to retrieve image data and statistics programmatically. Below are the instructions for both requesting and receiving data.
2. Requesting Data

To request data from the microservice, you need to make a GET request to the appropriate endpoint.
2.1 Example Request

Here is an example of how to make a request to retrieve image data:

http

GET /nasa-apod?date=2023-11-20

    Replace /nasa-apod with the desired endpoint.
    Specify the required parameters in the query string, such as date.

3. Receiving Data

Data from the microservice is returned in JSON format. You can receive and parse this data in your application.

The response will include various image statistics, such as format, dimensions, and file size. You can access these statistics in your code.
4. UML Sequence Diagram

Below is a UML sequence diagram that illustrates how requesting and receiving data works:

<img width="468" alt="image" src="https://github.com/r22222/CS361-Assignment-6/assets/76956944/09f79bc5-1f04-4bc0-9087-e5b2ad2064a7">
