import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { subDays } from 'date-fns'
import { Tooltip } from 'react-tooltip'
import './heatmap.css'

export default function Heatmap({ activityData, setSelectedDate }) {
    return (
        <div className='scale-[0.9] w-full h-full max-w-[850px] border-white border-4 p-4'>
            <CalendarHeatmap
                startDate={subDays(new Date(), 200)}
                endDate={new Date()}
                values={activityData}
                classForValue={(value) => {
                    if (!value || value.count === undefined) return 'color-empty'
                    if (value.count === 1) return 'color-attended'
                    if (value.count === -1) return 'color-cancelled'
                    return 'color-not-attended'
                }}
                tooltipDataAttrs={(value) => {
                    if (!value || !value.date) return {}
                    let attendanceText =
                        value.count === 1
                            ? 'Attended'
                            : value.count === -1
                            ? 'Cancelled'
                            : 'Not Attended'
                    return {
                        'data-tooltip-id': 'attendance-tooltip',
                        'data-tooltip-content': `${value.date}: ${attendanceText}`,
                    }
                }}
                onClick={(value) => {
                    if (value && value.date) {
                        setSelectedDate(value.date)
                    }
                }}
            />
            <Tooltip
                id="attendance-tooltip"
                style={{
                    fontSize: '18px',
                    padding: '12px 16px',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    borderRadius: '8px',
                    maxWidth: 'none',
                }}
            />
        </div>
    )
}
