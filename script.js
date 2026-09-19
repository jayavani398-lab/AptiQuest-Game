/* =========================================================
   APTIQUEST - GAME JAVASCRIPT
   ========================================================= */

/* PLAYER STATE */
let playerName = "";
let playerAge = 0;

/* GAME STATE */
let currentLevel = 1;
let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let timeLeft = 20;
let timer = null;
let questions = [];
let clueUsed = false;

const QUESTIONS_PER_LEVEL = 5;
const PASS_REQUIRED = 3; /* need 3 correct out of 5 to pass a level */

/* =========================================================
   QUESTION BANK
   Junior questions are grouped by age band so 6-8, 9-11,
   12-14 and 15-17 each get their own difficulty.
   ========================================================= */

const questionBank = {

    /* ================= AGE 6-8 : VERY EASY ================= */
    junior1: {
        1: [
            { question: "What is 2 + 3?", options: ["4", "5", "6", "7"], answer: "5", clue: "💡 Count on your fingers starting from 2." },
            { question: "Which number comes after 7?", options: ["6", "8", "9", "10"], answer: "8", clue: "💡 Count forward: 7, __." },
            { question: "How many sides does a square have?", options: ["3", "4", "5", "6"], answer: "4", clue: "💡 Think of a box shape." },
            { question: "What is 5 - 2?", options: ["2", "3", "4", "5"], answer: "3", clue: "💡 Take away 2 from 5." },
            { question: "Which is bigger: 6 or 9?", options: ["6", "9", "Same", "Cannot say"], answer: "9", clue: "💡 9 comes after 6 when counting." }
        ],
        2: [
            { question: "What is 4 + 4?", options: ["6", "7", "8", "9"], answer: "8", clue: "💡 Double the number 4." },
            { question: "Which shape has 3 sides?", options: ["Circle", "Square", "Triangle", "Star"], answer: "Triangle", clue: "💡 Tri means three." },
            { question: "What comes before 10?", options: ["8", "9", "11", "12"], answer: "9", clue: "💡 Count backward from 10." },
            { question: "What is 9 - 3?", options: ["5", "6", "7", "8"], answer: "6", clue: "💡 Take away 3 from 9." },
            { question: "How many days are in a week?", options: ["5", "6", "7", "8"], answer: "7", clue: "💡 Monday to Sunday." }
        ],
        3: [
            { question: "What is 6 + 3?", options: ["8", "9", "10", "11"], answer: "9", clue: "💡 Add 3 more to 6." },
            { question: "Which number is smallest?", options: ["12", "5", "20", "15"], answer: "5", clue: "💡 Look for the tiniest value." },
            { question: "What is 10 - 4?", options: ["5", "6", "7", "8"], answer: "6", clue: "💡 Take away 4 from 10." },
            { question: "How many fingers are on one hand?", options: ["4", "5", "6", "10"], answer: "5", clue: "💡 Look at your own hand." },
            { question: "What comes next: 1, 2, 3, 4, ?", options: ["3", "5", "6", "7"], answer: "5", clue: "💡 Keep counting upward." }
        ],
        4: [
            { question: "What is 7 + 5?", options: ["11", "12", "13", "14"], answer: "12", clue: "💡 Add 5 more to 7." },
            { question: "Which is an even number?", options: ["3", "5", "7", "8"], answer: "8", clue: "💡 Even numbers can be split into two equal parts." },
            { question: "What is 12 - 5?", options: ["6", "7", "8", "9"], answer: "7", clue: "💡 Take away 5 from 12." },
            { question: "How many months are in a year?", options: ["10", "11", "12", "13"], answer: "12", clue: "💡 Think of the calendar." },
            { question: "What is double of 4?", options: ["6", "7", "8", "9"], answer: "8", clue: "💡 4 + 4." }
        ],
        5: [
            { question: "What is 8 + 6?", options: ["12", "13", "14", "15"], answer: "14", clue: "💡 Add 6 more to 8." },
            { question: "Which number is odd?", options: ["4", "6", "9", "10"], answer: "9", clue: "💡 Odd numbers cannot split evenly." },
            { question: "What is 15 - 7?", options: ["6", "7", "8", "9"], answer: "8", clue: "💡 Take away 7 from 15." },
            { question: "How many legs does a cat have?", options: ["2", "3", "4", "5"], answer: "4", clue: "💡 Think of a pet cat walking." },
            { question: "What comes next: 5, 10, 15, ?", options: ["18", "20", "22", "25"], answer: "20", clue: "💡 Add 5 each time." }
        ]
    },

    /* ================= AGE 9-11 : LIGHT-TOUGH ================= */
    junior2: {
        1: [
            { question: "What is 6 × 4?", options: ["20", "22", "24", "26"], answer: "24", clue: "💡 6 groups of 4." },
            { question: "What is 45 + 28?", options: ["63", "70", "73", "83"], answer: "73", clue: "💡 Add the ones, then the tens." },
            { question: "You have 20 candies and eat 6. How many are left?", options: ["12", "13", "14", "16"], answer: "14", clue: "💡 Subtract 6 from 20." },
            { question: "What is 81 ÷ 9?", options: ["7", "8", "9", "10"], answer: "9", clue: "💡 9 × 9 = 81." },
            { question: "Which number is a multiple of 5?", options: ["22", "27", "35", "43"], answer: "35", clue: "💡 Multiples of 5 end in 0 or 5." }
        ],
        2: [
            { question: "What is 7 × 8?", options: ["54", "56", "58", "64"], answer: "56", clue: "💡 7 groups of 8." },
            { question: "What is 96 - 47?", options: ["39", "49", "59", "69"], answer: "49", clue: "💡 Borrow from the tens place." },
            { question: "A box has 12 pencils. How many pencils in 4 boxes?", options: ["36", "40", "44", "48"], answer: "48", clue: "💡 12 × 4." },
            { question: "What is 100 ÷ 4?", options: ["20", "25", "30", "35"], answer: "25", clue: "💡 4 × 25 = 100." },
            { question: "What comes next: 3, 6, 9, 12, ?", options: ["14", "15", "16", "18"], answer: "15", clue: "💡 Add 3 each time." }
        ],
        3: [
            { question: "What is 9 × 6?", options: ["52", "54", "56", "58"], answer: "54", clue: "💡 9 groups of 6." },
            { question: "What is half of 50?", options: ["20", "25", "30", "35"], answer: "25", clue: "💡 Divide 50 by 2." },
            { question: "A train has 8 coaches with 40 seats each. Find the total seats.", options: ["300", "320", "340", "360"], answer: "320", clue: "💡 8 × 40." },
            { question: "What is 144 ÷ 12?", options: ["10", "11", "12", "14"], answer: "12", clue: "💡 12 × 12 = 144." },
            { question: "Which is a prime number?", options: ["9", "15", "17", "21"], answer: "17", clue: "💡 A prime number has only two factors." }
        ],
        4: [
            { question: "What is 12 × 5?", options: ["55", "60", "65", "70"], answer: "60", clue: "💡 12 groups of 5." },
            { question: "What is 3/4 of 100?", options: ["65", "70", "75", "80"], answer: "75", clue: "💡 Find 1/4 first, then multiply by 3." },
            { question: "A pen costs ₹8. What is the cost of 7 pens?", options: ["48", "52", "56", "60"], answer: "56", clue: "💡 8 × 7." },
            { question: "What is 121 ÷ 11?", options: ["9", "10", "11", "12"], answer: "11", clue: "💡 11 × 11 = 121." },
            { question: "What comes next: 2, 4, 8, 16, ?", options: ["20", "24", "28", "32"], answer: "32", clue: "💡 Double each number." }
        ],
        5: [
            { question: "What is 11 × 11?", options: ["111", "112", "121", "131"], answer: "121", clue: "💡 11 squared." },
            { question: "What is 25% of 80?", options: ["15", "20", "25", "30"], answer: "20", clue: "💡 25% is one-fourth." },
            { question: "A shop has 5 shelves with 24 books each. Find the total books.", options: ["100", "110", "120", "130"], answer: "120", clue: "💡 5 × 24." },
            { question: "What is 225 ÷ 15?", options: ["13", "14", "15", "16"], answer: "15", clue: "💡 15 × 15 = 225." },
            { question: "Which number completes: 10, 20, 30, ?, 50", options: ["35", "40", "45", "48"], answer: "40", clue: "💡 Add 10 each time." }
        ]
    },

    /* ================= AGE 12-14 : MODERATE ================= */
    junior3: {
        1: [
            { question: "What is 20% of 150?", options: ["20", "25", "30", "35"], answer: "30", clue: "💡 Find 10% first, then double it." },
            { question: "If x + 5 = 12, find x.", options: ["5", "6", "7", "8"], answer: "7", clue: "💡 Move 5 to the other side." },
            { question: "Find the area of a rectangle 6cm × 4cm.", options: ["20", "22", "24", "26"], answer: "24", clue: "💡 Area = length × breadth." },
            { question: "Simplify the ratio 8:12.", options: ["2:3", "3:4", "4:5", "1:2"], answer: "2:3", clue: "💡 Divide both sides by 4." },
            { question: "What is 3² + 4²?", options: ["20", "22", "23", "25"], answer: "25", clue: "💡 9 + 16." }
        ],
        2: [
            { question: "What is 35% of 200?", options: ["60", "65", "70", "75"], answer: "70", clue: "💡 Find 10% then multiply by 3.5." },
            { question: "If 2x = 18, find x.", options: ["7", "8", "9", "10"], answer: "9", clue: "💡 Divide both sides by 2." },
            { question: "Find the perimeter of a square with side 9cm.", options: ["27", "32", "36", "40"], answer: "36", clue: "💡 Perimeter = 4 × side." },
            { question: "A class has 20 boys and 15 girls. Find the ratio of boys to girls.", options: ["3:4", "4:3", "5:4", "4:5"], answer: "4:3", clue: "💡 Simplify 20:15." },
            { question: "What is the average of 12, 18 and 24?", options: ["16", "17", "18", "20"], answer: "18", clue: "💡 Add them and divide by 3." }
        ],
        3: [
            { question: "What is 15% of 400?", options: ["50", "55", "60", "65"], answer: "60", clue: "💡 Find 10% + 5%." },
            { question: "If x - 4 = 10, find x.", options: ["12", "13", "14", "15"], answer: "14", clue: "💡 Move 4 to the other side." },
            { question: "A rectangle's length is 12cm and breadth is 5cm. Find its area.", options: ["50", "55", "60", "65"], answer: "60", clue: "💡 Area = length × breadth." },
            { question: "Simplify 15:25.", options: ["2:3", "3:4", "3:5", "4:5"], answer: "3:5", clue: "💡 Divide both sides by 5." },
            { question: "What is (5 + 3) × 2?", options: ["14", "16", "18", "20"], answer: "16", clue: "💡 Solve the bracket first." }
        ],
        4: [
            { question: "What is 40% of 250?", options: ["90", "95", "100", "105"], answer: "100", clue: "💡 Find 10% then multiply by 4." },
            { question: "If 3x + 2 = 17, find x.", options: ["4", "5", "6", "7"], answer: "5", clue: "💡 Subtract 2, then divide by 3." },
            { question: "A garden is 10m long and 8m wide. Find its perimeter.", options: ["32", "34", "36", "38"], answer: "36", clue: "💡 Perimeter = 2 × (length + breadth)." },
            { question: "Sugar and flour are in ratio 2:5. If sugar is 4kg, find the flour.", options: ["8", "10", "12", "14"], answer: "10", clue: "💡 4kg matches 2 parts, so 1 part = 2kg." },
            { question: "What is 7² - 2²?", options: ["40", "42", "45", "47"], answer: "45", clue: "💡 49 - 4." }
        ],
        5: [
            { question: "What is 60% of 350?", options: ["190", "200", "210", "220"], answer: "210", clue: "💡 Find 10% then multiply by 6." },
            { question: "If x/4 = 9, find x.", options: ["32", "34", "36", "38"], answer: "36", clue: "💡 Multiply both sides by 4." },
            { question: "A cube has a side of 5cm. Find its volume.", options: ["100", "110", "120", "125"], answer: "125", clue: "💡 Volume = side³." },
            { question: "Two numbers are in ratio 3:7 and sum to 50. Find the smaller number.", options: ["12", "15", "18", "20"], answer: "15", clue: "💡 Total parts = 10, so 1 part = 5." },
            { question: "What comes next: 4, 9, 16, 25, ?", options: ["30", "32", "34", "36"], answer: "36", clue: "💡 These are perfect squares." }
        ]
    },

    /* ================= AGE 15-17 : TEEN APTITUDE ================= */
    junior4: {
        1: [
            { question: "A shirt costing ₹800 is sold at a 25% discount. Find the sale price.", options: ["₹550", "₹600", "₹650", "₹700"], answer: "₹600", clue: "💡 25% of 800 is 200; subtract it." },
            { question: "A car covers 150 km in 3 hours. Find its speed.", options: ["40 km/h", "45 km/h", "50 km/h", "55 km/h"], answer: "50 km/h", clue: "💡 Speed = distance ÷ time." },
            { question: "Cost price is ₹250 and profit is 20%. Find the selling price.", options: ["₹280", "₹290", "₹300", "₹310"], answer: "₹300", clue: "💡 Add 20% of 250 to 250." },
            { question: "Solve for x: 2x - 5 = 11.", options: ["6", "7", "8", "9"], answer: "8", clue: "💡 Add 5, then divide by 2." },
            { question: "A bag has 4 red and 6 blue balls. Find the probability of picking a red ball.", options: ["2/5", "1/2", "3/5", "1/3"], answer: "2/5", clue: "💡 Red balls ÷ total balls." }
        ],
        2: [
            { question: "A book is marked ₹500 with a 15% discount. Find the discount amount.", options: ["₹65", "₹70", "₹75", "₹80"], answer: "₹75", clue: "💡 15% of 500." },
            { question: "A cyclist travels 60 km in 4 hours. Find the average speed.", options: ["12 km/h", "13 km/h", "14 km/h", "15 km/h"], answer: "15 km/h", clue: "💡 Divide distance by time." },
            { question: "CP = ₹400 and SP = ₹460. Find the profit percentage.", options: ["12%", "14%", "15%", "16%"], answer: "15%", clue: "💡 Profit ÷ CP × 100." },
            { question: "Solve for x: 3x + 7 = 22.", options: ["4", "5", "6", "7"], answer: "5", clue: "💡 Subtract 7, then divide by 3." },
            { question: "What is the probability of getting a head when tossing a coin?", options: ["1/4", "1/3", "1/2", "1"], answer: "1/2", clue: "💡 A coin has two equally likely sides." }
        ],
        3: [
            { question: "A phone worth ₹12,000 is sold at a 10% loss. Find the selling price.", options: ["₹10,200", "₹10,500", "₹10,800", "₹11,000"], answer: "₹10,800", clue: "💡 Subtract 10% of 12,000." },
            { question: "Two trains move towards each other at 40 km/h and 60 km/h. Find their relative speed.", options: ["80 km/h", "90 km/h", "100 km/h", "110 km/h"], answer: "100 km/h", clue: "💡 Add both speeds together." },
            { question: "Find the simple interest on ₹2000 at 5% for 3 years.", options: ["₹250", "₹280", "₹300", "₹320"], answer: "₹300", clue: "💡 SI = P × R × T ÷ 100." },
            { question: "Solve for x: x/3 + 4 = 10.", options: ["14", "16", "18", "20"], answer: "18", clue: "💡 Subtract 4, then multiply by 3." },
            { question: "A die is rolled once. Find the probability of getting a number greater than 4.", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/3", clue: "💡 Numbers 5 and 6 qualify, out of 6." }
        ],
        4: [
            { question: "An item marked ₹1500 gets two successive discounts of 10% and 10%. Find the final price.", options: ["₹1200", "₹1215", "₹1230", "₹1250"], answer: "₹1215", clue: "💡 Apply each discount one after another." },
            { question: "A boat travels 30 km downstream in 2 hours. Find its downstream speed.", options: ["12 km/h", "13 km/h", "15 km/h", "16 km/h"], answer: "15 km/h", clue: "💡 Speed = distance ÷ time." },
            { question: "SP = ₹690 and loss = 8%. Find the cost price.", options: ["₹720", "₹740", "₹750", "₹760"], answer: "₹750", clue: "💡 CP = SP ÷ (1 - loss%)." },
            { question: "Solve for x: 5x - 3 = 2x + 12.", options: ["4", "5", "6", "7"], answer: "5", clue: "💡 Move terms so x is on one side." },
            { question: "From a deck of 52 cards, one is drawn. Find the probability it is a king.", options: ["1/52", "1/26", "1/13", "1/4"], answer: "1/13", clue: "💡 There are 4 kings out of 52 cards." }
        ],
        5: [
            { question: "A trader marks goods 40% above cost and gives a 20% discount. Find his profit percentage.", options: ["10%", "12%", "14%", "15%"], answer: "12%", clue: "💡 Work out the final price as a percentage of cost." },
            { question: "A man walks 5 km in 1 hour, then runs 10 km in 1 hour. Find his average speed.", options: ["6 km/h", "6.5 km/h", "7 km/h", "7.5 km/h"], answer: "7.5 km/h", clue: "💡 Total distance ÷ total time." },
            { question: "Find the compound interest on ₹5000 at 10% p.a. for 2 years.", options: ["₹1000", "₹1030", "₹1050", "₹1100"], answer: "₹1050", clue: "💡 Apply 10% twice, compounding each year." },
            { question: "Solve for x: 2(x + 3) = 16.", options: ["4", "5", "6", "7"], answer: "5", clue: "💡 Divide both sides by 2 first." },
            { question: "Two dice are rolled together. Find the probability that the sum is 7.", options: ["1/6", "1/9", "1/12", "1/4"], answer: "1/6", clue: "💡 There are 6 favourable outcomes out of 36." }
        ]
    },

    /* ================= AGE 18+ : ADULT ================= */
    adult: {
        1: [
            { question: "What is 20% of 250?", options: ["25", "40", "50", "60"], answer: "50", clue: "💡 Calculate 20 out of every 100." },
            { question: "A product costs ₹500. What is the price after a 10% discount?", options: ["₹450", "₹460", "₹480", "₹490"], answer: "₹450", clue: "💡 Find 10% of ₹500 first." },
            { question: "What comes next? 3, 6, 12, 24, ?", options: ["36", "42", "48", "50"], answer: "48", clue: "💡 The pattern doubles." },
            { question: "What is the average of 10, 20 and 30?", options: ["15", "20", "25", "30"], answer: "20", clue: "💡 Add them and divide by 3." },
            { question: "What is 15% of 400?", options: ["40", "50", "60", "70"], answer: "60", clue: "💡 Find 10% + 5%." }
        ],
        2: [
            { question: "A train travels 60 km in 1 hour. How far in 3 hours?", options: ["120 km", "150 km", "180 km", "200 km"], answer: "180 km", clue: "💡 Distance = speed × time." },
            { question: "What is 25% of 800?", options: ["100", "150", "200", "250"], answer: "200", clue: "💡 25% is one-fourth." },
            { question: "If 5 pens cost ₹100, what is the cost of one pen?", options: ["₹10", "₹15", "₹20", "₹25"], answer: "₹20", clue: "💡 Divide ₹100 by 5." },
            { question: "What comes next? 4, 8, 16, 32, ?", options: ["48", "56", "64", "72"], answer: "64", clue: "💡 Double each number." },
            { question: "What is 144 ÷ 12?", options: ["10", "11", "12", "14"], answer: "12", clue: "💡 12 × 12 = 144." }
        ],
        3: [
            { question: "A salary of ₹20,000 increases by 10%. What is the new salary?", options: ["₹21,000", "₹22,000", "₹23,000", "₹24,000"], answer: "₹22,000", clue: "💡 Calculate 10% of ₹20,000." },
            { question: "What is 30% of 500?", options: ["100", "120", "150", "180"], answer: "150", clue: "💡 30% of 500." },
            { question: "The ratio 2:3 has a total of 25. What is the first part?", options: ["8", "10", "12", "15"], answer: "10", clue: "💡 Total ratio parts = 5." },
            { question: "What is the average of 20, 30, 40 and 50?", options: ["30", "35", "40", "45"], answer: "35", clue: "💡 Add all values and divide by 4." },
            { question: "If x + 7 = 15, what is x?", options: ["6", "7", "8", "9"], answer: "8", clue: "💡 Move 7 to the other side." }
        ],
        4: [
            { question: "A shop gives 20% discount on ₹1000. What is the final price?", options: ["₹700", "₹750", "₹800", "₹850"], answer: "₹800", clue: "💡 20% of ₹1000 = ₹200." },
            { question: "What is 12.5% of 800?", options: ["50", "75", "100", "125"], answer: "100", clue: "💡 12.5% is one-eighth." },
            { question: "3 workers finish a job in 6 days. What are the total worker-days?", options: ["9", "12", "18", "24"], answer: "18", clue: "💡 Workers × days." },
            { question: "What is 18 × 5?", options: ["80", "90", "100", "110"], answer: "90", clue: "💡 18 × 10 ÷ 2." },
            { question: "What comes next? 2, 6, 18, 54, ?", options: ["108", "124", "162", "216"], answer: "162", clue: "💡 Multiply by 3 each time." }
        ],
        5: [
            { question: "If the cost price is ₹500 and selling price is ₹600, what is the profit?", options: ["₹50", "₹75", "₹100", "₹150"], answer: "₹100", clue: "💡 Selling price minus cost price." },
            { question: "What is the simple interest on ₹1000 at 10% for 2 years?", options: ["₹100", "₹150", "₹200", "₹250"], answer: "₹200", clue: "💡 SI = P × R × T / 100." },
            { question: "A car travels 240 km in 4 hours. What is its average speed?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], answer: "60 km/h", clue: "💡 Speed = distance ÷ time." },
            { question: "What is 35% of 200?", options: ["50", "60", "70", "80"], answer: "70", clue: "💡 Find 30% + 5%." },
            { question: "If 8 notebooks cost ₹240, what is the price of one?", options: ["₹20", "₹25", "₹30", "₹40"], answer: "₹30", clue: "💡 Divide ₹240 by 8." }
        ]
    }
};

/* =========================================================
   AGE BAND HELPERS
   ========================================================= */

function getAgeBracket(age) {
    if (age >= 18) return "adult";
    if (age >= 15) return "junior4";
    if (age >= 12) return "junior3";
    if (age >= 9) return "junior2";
    return "junior1"; /* covers the minimum allowed age (5) through 8 */
}

function getQuestionSet(level) {
    const bracket = getAgeBracket(playerAge);
    const bank = questionBank[bracket];
    return bank ? bank[level] : null;
}

/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function hideAllScreens() {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
}

function goHome() {
    clearInterval(timer);
    hideAllScreens();
    document.getElementById("homeScreen").classList.remove("hidden");
    updateStats();
    updateLevelMap();
}

/* =========================================================
   AGE SCREEN
   ========================================================= */

function showAgeScreen() {
    hideAllScreens();
    document.getElementById("ageScreen").classList.remove("hidden");
}

function continueGame() {
    const nameInput = document.getElementById("playerName");
    const ageInput = document.getElementById("playerAge");
    const errorMessage = document.getElementById("errorMessage");

    playerName = nameInput.value.trim();
    playerAge = parseInt(ageInput.value);

    if (playerName === "") {
        errorMessage.textContent = "⚠️ Please enter your name.";
        return;
    }

    if (isNaN(playerAge) || playerAge < 5 || playerAge > 100) {
        errorMessage.textContent = "⚠️ Please enter a valid age.";
        return;
    }

    errorMessage.textContent = "";

    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerAge", playerAge);

    startLevel(1);
}

/* =========================================================
   START LEVEL
   ========================================================= */

function startLevel(level) {
    if (!playerAge) {
        showAgeScreen();
        return;
    }

    const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    if (level > unlockedLevel) {
        alert(`🔒 Level ${level} is locked!\nComplete Level ${level - 1} first.`);
        return;
    }

    currentLevel = level;
    currentQuestion = 0;
    score = 0;
    correctCount = 0;
    clueUsed = false;

    questions = getQuestionSet(level);

    if (!questions) {
        alert("⚠️ Questions for this level are not available yet.");
        return;
    }

    hideAllScreens();
    document.getElementById("quizScreen").classList.remove("hidden");
    document.getElementById("levelTitle").textContent = `🌟 Level ${level}`;
    document.getElementById("gameScore").textContent = "0";

    showQuestion();
}

/* =========================================================
   LOCKED LEVEL
   ========================================================= */

function tryLevel(level) {
    const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    if (level <= unlockedLevel) {
        startLevel(level);
    } else {
        alert(`🔒 Level ${level} is locked!\nComplete Level ${level - 1} first.`);
    }
}

/* =========================================================
   SHOW QUESTION
   ========================================================= */

function showQuestion() {
    clearInterval(timer);
    timeLeft = 20;
    clueUsed = false;

    const questionData = questions[currentQuestion];

    document.getElementById("questionNumber").textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("question").textContent = questionData.question;
    document.getElementById("clueText").textContent = "";
    document.getElementById("clueButton").disabled = false;
    document.getElementById("nextButton").disabled = true;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach(optionText => {
        const optionButton = document.createElement("button");
        optionButton.className = "option";
        optionButton.type = "button";
        optionButton.textContent = optionText;
        optionButton.onclick = () => checkAnswer(optionButton, optionText);
        optionsContainer.appendChild(optionButton);
    });

    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById("progress").style.width = progress + "%";

    startTimer();
}

/* =========================================================
   CLUE (hint)
   ========================================================= */

function showClue() {
    const questionData = questions[currentQuestion];

    document.getElementById("clueText").textContent = questionData.clue;
    document.getElementById("clueButton").disabled = true;
    clueUsed = true;

    /* Using a clue costs 2 points, but score never goes below 0 */
    score = Math.max(0, score - 2);
    document.getElementById("gameScore").textContent = score;
}

/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            disableOptions();
            playWrongSound();
            document.getElementById("nextButton").disabled = false;
        }
    }, 1000);
}

/* =========================================================
   CHECK ANSWER
   ========================================================= */

function checkAnswer(selectedButton, selectedAnswer) {
    clearInterval(timer);

    const questionData = questions[currentQuestion];
    const allOptions = document.querySelectorAll(".option");

    allOptions.forEach(option => {
        option.disabled = true;
        if (option.textContent === questionData.answer) {
            option.classList.add("correct");
        }
    });

    if (selectedAnswer === questionData.answer) {
        selectedButton.classList.add("correct");
        score += 10; /* correct answer = 10 points */
        correctCount++;
        playCorrectSound();
    } else {
        selectedButton.classList.add("wrong");
        playWrongSound();
    }

    document.getElementById("gameScore").textContent = score;
    document.getElementById("nextButton").disabled = false;
}

/* =========================================================
   DISABLE OPTIONS (timeout)
   ========================================================= */

function disableOptions() {
    const questionData = questions[currentQuestion];
    const allOptions = document.querySelectorAll(".option");

    allOptions.forEach(option => {
        option.disabled = true;
        if (option.textContent === questionData.answer) {
            option.classList.add("correct");
        }
    });
}

/* =========================================================
   NEXT QUESTION
   ========================================================= */

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        completeLevel();
    }
}

/* =========================================================
   COMPLETE LEVEL
   ========================================================= */

function completeLevel() {
    clearInterval(timer);

    const totalQuestions = questions.length;

    /*
       PASS RULE:
       Out of 5 questions per level, at least 3 correct
       answers are needed to pass. 2 (or more) wrong answers
       means the level is failed and must be retried.
    */
    const passRequired = Math.ceil((totalQuestions * PASS_REQUIRED) / QUESTIONS_PER_LEVEL);
    const passed = correctCount >= passRequired;

    /*
       STAR RATING:
       Stars scale with how many questions were answered
       correctly out of the total — all correct gives 5 stars.
    */
    const stars = Math.min(5, Math.round((correctCount / totalQuestions) * 5));
    renderStars(stars);

    document.getElementById("correctSummary").textContent =
        `${correctCount}/${totalQuestions} correct`;

    /* XP and coins */
    const xpEarned = score + 25;
    const coinsEarned = Math.floor(score / 5) + 10;

    let totalXP = parseInt(localStorage.getItem("xp")) || 0;
    let totalCoins = parseInt(localStorage.getItem("coins")) || 0;

    totalXP += xpEarned;
    totalCoins += coinsEarned;

    localStorage.setItem("xp", totalXP);
    localStorage.setItem("coins", totalCoins);

    saveScore(passed, stars);

    if (passed) {
        unlockNextLevel();
    }

    document.getElementById("finalScore").textContent = score;
    document.getElementById("finalXP").textContent = xpEarned;
    document.getElementById("finalCoins").textContent = coinsEarned;

    if (passed) {
        document.getElementById("resultEmoji").textContent = "🏆";
        document.getElementById("resultTitle").textContent = "🎉 CONGRATULATIONS!";
        document.getElementById("resultMessage").textContent = "You have successfully passed! 🚀";

        playWinSound();
        setTimeout(speakCongratulations, 500);

        document.getElementById("nextLevelButton").style.display =
            currentLevel < 5 ? "inline-block" : "none";
        document.getElementById("retryButton").style.display = "none";
    } else {
        document.getElementById("resultEmoji").textContent = "😔";
        document.getElementById("resultTitle").textContent = "😔 OOPS!";
        document.getElementById("resultMessage").textContent =
            `You need at least ${passRequired}/${totalQuestions} correct to pass. Try again! 💪`;

        playWrongSound();
        setTimeout(speakRetry, 500);

        document.getElementById("nextLevelButton").style.display = "none";
        document.getElementById("retryButton").style.display = "inline-block";
    }

    hideAllScreens();
    document.getElementById("resultScreen").classList.remove("hidden");
}

/* =========================================================
   STAR RATING
   ========================================================= */

function renderStars(count) {
    const container = document.getElementById("starRating");
    container.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.textContent = i <= count ? "⭐" : "☆";
        container.appendChild(star);
    }
}

/* =========================================================
   UNLOCK NEXT LEVEL
   ========================================================= */

function unlockNextLevel() {
    let unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    if (currentLevel >= unlockedLevel) {
        unlockedLevel = currentLevel + 1;
    }

    if (unlockedLevel > 5) {
        unlockedLevel = 5;
    }

    localStorage.setItem("unlockedLevel", unlockedLevel);
    updateLevelMap();
}

/* =========================================================
   UPDATE LEVEL MAP
   ========================================================= */

function updateLevelMap() {
    const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    for (let level = 1; level <= 5; level++) {
        const button = document.getElementById(`level${level}`);
        if (!button) continue;

        const number = button.querySelector("span");

        if (level <= unlockedLevel) {
            button.classList.remove("locked");
            button.classList.add("unlocked");
            number.textContent = level;
        } else {
            button.classList.remove("unlocked");
            button.classList.add("locked");
            number.textContent = "🔒";
        }
    }
}

/* =========================================================
   GO TO NEXT LEVEL
   ========================================================= */

function goToNextLevel() {
    const nextLevel = currentLevel + 1;
    const unlockedLevel = parseInt(localStorage.getItem("unlockedLevel")) || 1;

    if (nextLevel <= unlockedLevel) {
        startLevel(nextLevel);
    } else {
        alert("🔒 Complete the current level first.");
    }
}

/* =========================================================
   RETRY LEVEL
   ========================================================= */

function retryLevel() {
    startLevel(currentLevel);
}

/* =========================================================
   SAVE PLAYER SCORE
   ========================================================= */

function saveScore(passed, stars) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.push({
        name: playerName,
        age: playerAge,
        category: playerAge < 18 ? "Under 18" : "18+",
        level: currentLevel,
        score: score,
        correct: correctCount,
        stars: stars,
        passed: passed,
        xp: score + 25,
        date: new Date().toLocaleDateString()
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

/* =========================================================
   STATS
   ========================================================= */

function updateStats() {
    const xp = localStorage.getItem("xp") || 0;
    const coins = localStorage.getItem("coins") || 0;

    document.getElementById("xp").textContent = xp;
    document.getElementById("coins").textContent = coins;

    const savedName = localStorage.getItem("playerName");
    if (savedName) {
        document.getElementById("welcomeMessage").textContent =
            `Welcome back, ${savedName}! Ready for another challenge?`;
    }
}

/* =========================================================
   LEADERBOARD
   ========================================================= */

function getLeaderboard() {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
}

function showLeaderboard() {
    hideAllScreens();
    document.getElementById("leaderboardScreen").classList.remove("hidden");
    showGlobalLeaderboard();
}

function showGlobalLeaderboard() {
    displayLeaderboard(getLeaderboard());
}

function showJuniorLeaderboard() {
    displayLeaderboard(getLeaderboard().filter(player => player.age < 18));
}

function showAdultLeaderboard() {
    displayLeaderboard(getLeaderboard().filter(player => player.age >= 18));
}

function displayLeaderboard(leaderboard) {
    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    if (leaderboard.length === 0) {
        list.innerHTML = `<p>No players yet. Be the first player! 🚀</p>`;
        return;
    }

    leaderboard.slice(0, 100).forEach((player, index) => {
        const row = document.createElement("div");
        row.className = "player-row";

        let medal;
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";
        else medal = index + 1;

        const starText = "⭐".repeat(player.stars || 0);

        row.innerHTML = `
            <div class="player-rank">${medal}</div>
            <div class="player-info">
                <b>${escapeHTML(player.name)}</b>
                <small>${player.category} • Level ${player.level} • ${starText}</small>
            </div>
            <div class="player-score">⭐ ${player.score}</div>
        `;

        list.appendChild(row);
    });
}

/* =========================================================
   ACHIEVEMENTS
   ========================================================= */

function showAchievements() {
    hideAllScreens();
    document.getElementById("achievementScreen").classList.remove("hidden");
}

/* =========================================================
   SOUND EFFECTS
   ========================================================= */

function playTone(frequency, duration, type = "sine") {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        gain.gain.setValueAtTime(0.18, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.log("Sound unavailable.");
    }
}

function playCorrectSound() {
    playTone(800, 0.12, "sine");
    setTimeout(() => playTone(1100, 0.15, "sine"), 100);
}

function playWrongSound() {
    playTone(250, 0.25, "sawtooth");
}

function playWinSound() {
    playTone(600, 0.12, "sine");
    setTimeout(() => playTone(800, 0.12, "sine"), 120);
    setTimeout(() => playTone(1000, 0.25, "sine"), 240);
}

/* =========================================================
   VOICE OVER
   ========================================================= */

function speakCongratulations() {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance("Congratulations! You have successfully passed.");
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1.1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

function speakRetry() {
    if (!("speechSynthesis" in window)) return;

    const speech = new SpeechSynthesisUtterance("Oops! Sorry, try again.");
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/* =========================================================
   PAGE LOAD
   ========================================================= */

window.onload = function () {
    if (!localStorage.getItem("unlockedLevel")) {
        localStorage.setItem("unlockedLevel", "1");
    }

    updateStats();
    updateLevelMap();

    const nextButton = document.getElementById("nextLevelButton");
    if (nextButton) {
        nextButton.style.display = "none";
    }
};