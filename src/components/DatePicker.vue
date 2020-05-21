<template>
    <div class="datepicker">
        <div class="month">
            <img height="30" class="left" @click="prevMonth" src="@/assets/images/chevron-right.svg" alt="Prev">
            {{ monthName }} {{ year }}
            <img height="30" @click="nextMonth" src="@/assets/images/chevron-right.svg" alt="next">
        </div>
        <div class="dates">
            <div class="weekdays">
                <span class="weekday" v-for="(day, index) in weekDays" :key="index">{{ day.substring(0, 2) }}</span>
            </div>
            <div class="days">
                <span class="day"
                    v-for="(day, j) in days"
                    @click="setDate(day.date)"
                    :key="j"
                    :class="{
                        'is-today': day.isToday,
                        'is-selected': day.isSelected,
                        'is-between': day.isInRange,
                        'is-range-end': day.isRangeEnd,
                        'is-range-start': day.isRangeStart,
                        'is-other-month': day.isOtherMonth
                    }">{{ day.dayNumber }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DatePicker",
    props: {
        highlightToday: {
            type: Boolean,
            default: true,
        },
        range: {
            type: Boolean,
            default: false,
        },
        value: [Date, Array],
    },
    data() {
        return {
            dateContext: new Date(),
            weekDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            weekReversed: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].reverse(),
            selected: Array.isArray(this.value) && this.value.length ? this.value[0].setHours(0, 0, 0, 0) : "",
            selectedTo: Array.isArray(this.value) && this.value.length && this.value[1] ? this.value[1].setHours(0, 0, 0, 0) : "",
        };
    },
    methods: {
        /**
         * Handles a next month change
         */
        nextMonth() {
            this.dateContext = new Date(this.dateContext.setMonth(this.dateContext.getMonth() + 1));
        },
        /**
         * Handles a previous month change
         */
        prevMonth() {
            this.dateContext = new Date(this.dateContext.setMonth(this.dateContext.getMonth() - 1));
        },
        /**
         * Sets the date
         * @param {Date} date
         */
        setDate(date) {
            if (this.range) {
                if (this.selected) {
                    if (this.selectedTo) {
                        this.selected = date;
                        this.selectedTo = "";
                        this.$emit("input", [this.selected.getTime()]);
                    } else {
                        if (new Date(date) > new Date(this.selected)) {
                            this.selectedTo = date;
                            this.$emit("input", [this.selected.getTime(), this.selectedTo.getTime()]);
                        } else if(new Date(date) < new Date(this.selected)) {
                            this.selectedTo = this.selected;
                            this.selected = date;
                            this.$emit("input", [this.selected.getTime(), this.selectedTo.getTime()]);
                        }
                    }
                } else {
                    this.selected = date;
                }
            } else {
                this.selected = date;
                this.$emit("input", date.getTime());
            }
        }
    },
    computed: {
        year() {
            return this.dateContext.getFullYear();
        },
        monthName() {
            return this.dateContext.toLocaleString(undefined, { month: "long" });
        },
        today() {
            return new Date().setHours(0, 0, 0, 0);
        },
        startWeekday() {
            return new Date( this.dateContext.getFullYear(), this.dateContext.getMonth(), 1).toLocaleString("en-US", {  weekday: "long" });
        },
        endWeekday() {
            return new Date( this.dateContext.getFullYear(), this.dateContext.getMonth() + 1, 0).toLocaleString("en-US", {  weekday: "long" });
        },
        daysInCurrentMonth() {
            const daysInMonthNumber = new Date(this.dateContext.getFullYear(), this.dateContext.getMonth() + 1, 0).getDate();
            const days = [];

            for (let day = 1; day <= daysInMonthNumber; day++) {
                days.push(new Date(this.dateContext.getFullYear(), this.dateContext.getMonth(), day));
            }

            return days;
        },
        days() {
            const days = [];

            // Insert dates from previous month into array, which is later used to populate days array
            const prevMonthDays = [];
            const prevMonthDate = new Date(this.dateContext.getFullYear(), this.dateContext.getMonth(), 0);
            const startWeekdayIndex = this.weekDays.indexOf(this.startWeekday) - 1;
            for (let i = 0; i <= startWeekdayIndex; i++) {
                prevMonthDays.push(new Date(prevMonthDate.setDate(prevMonthDate.getDate() - (i === 0 ? 0 : 1))));
            }

            // Insert dates from next month into array, which is later used to populate days array
            const nextMonthDays = [];
            const nextMonthDate = new Date(this.dateContext.getFullYear(), this.dateContext.getMonth() + 1, 0);
            const endWeekdayIndex = this.weekReversed.indexOf(this.endWeekday);
            for (let i = 1; i <= endWeekdayIndex; i++) {
                nextMonthDays.push(new Date(nextMonthDate.setDate(nextMonthDate.getDate() + 1)));
            }

            const pushDays = (day, isOtherMonth) => {
                const date = new Date(day);

                days.push({
                    isToday: date.getTime() === this.today && this.highlightToday,
                    isSelected: date.getTime() === new Date(this.selected).getTime(),
                    isInRange: date > new Date(this.selected) && date < new Date(this.selectedTo),
                    isRangeStart: this.selectedTo && date.getTime() === new Date(this.selected).getTime(),
                    isRangeEnd: date.getTime() === new Date(this.selectedTo).getTime(),
                    dayNumber: date.getDate(),
                    isOtherMonth,
                    date,
                });
            };

            // Populate days array with previous month days
            prevMonthDays.reverse().forEach(day => pushDays(day, true));

            // Populate days array with current month days
            this.daysInCurrentMonth.forEach(day => pushDays(day));

            // Populate days array with next month days
            nextMonthDays.forEach(day => pushDays(day, true));

            return days;
        },
    }
};
</script>

<style lang="scss">
    :root {
        --primary: #00b2f2;
        --primary-alt: #ccf1ff;
        --body-color: #333;
        --gray: #666;
        --gray-lighter: #d9d9d9;
    }

    body {
        background-color: var(--gray-lighter);
        font-family: Helvetica, sans-serif;
    }

    .datepicker {
        background: #fff;
        color: var(--body-color);
        box-shadow: 0 0 rgba(0, 0, 0, 0.1);
        font-size: 13px;
        text-align: center;

        .dates {
            padding: 0 1.5rem 1rem;
        }
    }

    .month {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0.5rem;

        img {
            cursor: pointer;
        }

        .left {
            transform: rotate(180deg);
        }
    }

    .weekdays {
        display: flex;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-lighter);
        color: var(--gray-lighter);

        .weekday {
            width: calc(100% / 7);
        }
    }

    .days {
        display: flex;
        flex-wrap: wrap;

        .day {
            height: 0;
            width: calc(100% / 7);
            padding-bottom: calc(100% / 14);
            padding-top: calc(100% / 14);
            margin-top: 0.75rem;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
        }

        .is-today,
        .is-selected,
        .is-between,
        .is-range-end,
        .is-range-start {
            position: relative;
            background: var(--primary);
            border-radius: 100px;
        }

        .is-today {
            color: #fff;
            font-weight: 600;
        }

        .is-other-month {
            color: var(--gray-lighter);
        }

        .is-selected,
        .is-between,
        .is-range-end {
            color: var(--primary);
            background: var(--primary-alt);
        }

        .is-between:not(.is-selected) {
            border-radius: 0;
        }

        .is-range-end {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .is-range-start {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
</style>
