'use client';

interface TestInfoFormProps {
	testInfo: {
		title: string;
		date: string;
		name: string;
	};
	onTestInfoChange: (testInfo: { title: string; date: string; name: string }) => void;
}

export default function TestInfoForm({ testInfo, onTestInfoChange }: TestInfoFormProps) {
	const handleChange = (key: string, value: string) => {
		onTestInfoChange({
			...testInfo,
			[key]: value,
		});
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			<h3 className='text-lg font-semibold mb-4 text-right'>معلومات الاختبار</h3>

			<div className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1 text-right'>عنوان الاختبار:</label>
					<input
						type='text'
						value={testInfo.title}
						onChange={(e) => handleChange('title', e.target.value)}
						placeholder='مثال: اختبار Flutter الأساسي'
						className='w-full border border-gray-300 rounded px-3 py-2 text-right'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1 text-right'>التاريخ:</label>
					<input
						type='date'
						value={testInfo.date}
						onChange={(e) => handleChange('date', e.target.value)}
						className='w-full border border-gray-300 rounded px-3 py-2'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1 text-right'>اسم الطالب:</label>
					<input
						type='text'
						value={testInfo.name}
						onChange={(e) => handleChange('name', e.target.value)}
						placeholder='اسم الطالب'
						className='w-full border border-gray-300 rounded px-3 py-2 text-right'
					/>
				</div>
			</div>
		</div>
	);
}
