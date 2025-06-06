import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { subDays } from 'date-fns'
import { Tooltip } from 'react-tooltip'


export default function Heatmap({ activityData, setSelectedDate }) {
    return (
        <div className='scale-[0.9] w-full h-full max-w-[800px] border-white border-4 p-2' >
            <CalendarHeatmap startDate={subDays(new Date(), 216)} endDate={new Date()} values={activityData} tooltipDataAttrs={value => {
                if (!value || !value.date) return {}
                let attendanceText = value.count > 0 ? 'Attended' : 'Not attended'
                return {
                    'data-tooltip-id': 'attendance-tooltip',
                    'data-tooltip-content': `${value.date}: ${attendanceText}`,
                }
            }}
                onClick={value => {
                    if (value && value.date) {
                        setSelectedDate(value.date)
                    }
                }} />
            <Tooltip id="attendance-tooltip" style={{ fontSize: '18px', padding: '12px 16px', backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', maxWidth: 'none' }} />
        </div>
    )
}