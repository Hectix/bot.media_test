<template>
    <div class="datepicker">
        <div class="months">
            <img height="30" class="left" @click="prevMonth" src="@/assets/images/chevron-right.svg" alt="Prev">
            {{ monthName }} {{ year }}
            <img height="30" @click="nextMonth" src="@/assets/images/chevron-right.svg" alt="next">
        </div>
        <table>
            <thead class="weekdays">
                <tr>
                    <th v-for="(day, index) in weekDays" :key="index">{{ day.substring(0, 2) }}</th>
                </tr>
            </thead>
            <tbody class="days">
                <template v-for="(week, i) in weeks">
                    <tr :key="`spacer${i}`" class="spacer"><td></td></tr>
                    <tr :key="i">
                        <td v-for="(date, j) in week"
                            @click="setDate(date.date)"
                            :key="j"
                            :class="{
                                'is-today': date.isToday,
                                'is-selected': date.isSelected,
                                'is-between': date.isInRange,
                                'is-range-end': date.isRangeEnd,
                                'is-range-start': date.isRangeStart
                            }">
                            {{ date.dayNumber }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import {chunk} from "../util/base";

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
            selected: Array.isArray(this.value) ? this.value[0].setHours(0, 0, 0, 0) : this.value,
            selectedTo: Array.isArray(this.value) ? this.value[1].setHours(0, 0, 0, 0) : "",
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
                        this.$emit("input", [this.selected, this.selectedTo]);
                    } else {
                        if (new Date(date) > new Date(this.selected)) {
                            this.selectedTo = date;
                            this.$emit("input", [this.selected, this.selectedTo]);
                        } else {
                            this.selectedTo = this.selected;
                            this.selected = date;
                        }
                    }
                } else {
                    this.selected = date;
                }
            } else {
                this.selected = date;
                this.$emit("input", date);
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
        daysInMonth() {
            const daysInMonthNumber = new Date(this.dateContext.getFullYear(), this.dateContext.getMonth() + 1, 0).getDate();
            const days = [];

            for (let day = 1; day <= daysInMonthNumber; day++) {
                days.push(new Date(this.dateContext.getFullYear(), this.dateContext.getMonth(), day));
            }

            return days;
        },
        weeks() {
            const startWeekdayIndex = this.weekDays.indexOf(this.startWeekday) - 1;
            const days = [];

            // Insert empty strings until startWeekday
            for (let i = 0; i <= startWeekdayIndex; i++) {
                days.push({
                    day: ""
                });
            }

            this.daysInMonth.forEach(day => {
                const date = new Date(day);

                days.push({
                    isToday: date.getTime() === this.today && this.highlightToday,
                    isSelected: date.getTime() === new Date(this.selected).getTime(),
                    isInRange: date > new Date(this.selected) && date < new Date(this.selectedTo),
                    isRangeStart: this.selectedTo && date.getTime() === new Date(this.selected).getTime(),
                    isRangeEnd: date.getTime() === new Date(this.selectedTo).getTime(),
                    date,
                    dayNumber: date.getDate()
                });
            });

            return chunk(days, 7);
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
    }

    .datepicker {
        display: inline-block;
        font-family: Helvetica, sans-serif;
        background: #fff;
        color: var(--body-color);
        box-shadow: 0 0 rgba(0, 0, 0, 0.1);

        table {
            border-collapse: separate;
            border-spacing: 0;
            padding: 0 1.5rem 1rem;
        }
    }

    .months {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        padding: 1rem 0.5rem;

        img {
            cursor: pointer;
        }

        .left {
            transform: rotate(180deg);
        }
    }

    .weekdays {
        th {
            color: var(--gray-lighter);
            font-weight: 400;
            text-align: center;
            font-size: 13px;
            border-bottom: 1px solid var(--gray-lighter);
            padding: 0.5rem;
        }
    }

    .days {
        td {
            width: 40px;
            height: 40px;
            font-size: 13px;
            text-align: center;
            cursor: pointer;
        }

        .spacer {
            td {
                height: 0.4rem;
            }
        }

        .is-today,
        .is-selected,
        .is-between,
        .is-range-end,
        .is-range-start {
            position: relative;
            z-index: 10;
            background: var(--primary);
            border-radius: 22px;
        }

        .is-today {
            color: #fff;
            font-weight: 600;
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
