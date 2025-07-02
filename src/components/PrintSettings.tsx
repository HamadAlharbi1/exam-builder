'use client';

import type { PrintSettings, QuestionSelection, QuestionSelectionMode } from '@/types';
import { useState } from 'react';

interface PrintSettingsProps {
	settings: PrintSettings;
	onSettingsChange: (settings: PrintSettings) => void;
	totalQuestions: number;
}

// Type guards
function isRange(value: unknown): value is QuestionSelection['range'] {
	return (
		typeof value === 'object' &&
		value !== null &&
		'from' in value &&
		'to' in value &&
		typeof (value as Record<string, unknown>).from === 'number' &&
		typeof (value as Record<string, unknown>).to === 'number'
	);
}
function isSpecific(value: unknown): value is number[] {
	return Array.isArray(value) && value.every((v) => typeof v === 'number');
}

export default function PrintSettings({ settings, onSettingsChange, totalQuestions }: PrintSettingsProps) {
	const [specificInput, setSpecificInput] = useState(settings.questionSelection.specific?.join(', ') || '');

	const handleChange = (key: keyof PrintSettings, value: PrintSettings[keyof PrintSettings]) => {
		onSettingsChange({
			...settings,
			[key]: value,
		});
	};

	const handleQuestionSelectionChange = (
		mode: QuestionSelectionMode,
		value?: QuestionSelection['range'] | number[]
	) => {
		let questionSelection: QuestionSelection = { mode };

		if (mode === 'range' && isRange(value)) {
			questionSelection = {
				...questionSelection,
				range: value,
			};
		} else if (mode === 'specific' && isSpecific(value)) {
			questionSelection = {
				...questionSelection,
				specific: value,
			};
		}

		handleChange('questionSelection', questionSelection);
	};

	const handleSpecificInputChange = (input: string) => {
		setSpecificInput(input);
		const numbers = input
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s !== '')
			.map((s) => parseInt(s))
			.filter((n) => !isNaN(n) && n > 0 && n <= totalQuestions);

		handleQuestionSelectionChange('specific', numbers);
	};

	const getSelectedQuestionsCount = () => {
		const { mode, range, specific } = settings.questionSelection;

		if (mode === 'all') return totalQuestions;
		if (mode === 'range' && range) return range.to - range.from + 1;
		if (mode === 'specific' && specific) return specific.length;
		return 0;
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md'>
			<h3 className='text-lg font-semibold mb-4 text-right'>إعدادات الطباعة</h3>

			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<label className='text-sm font-medium text-gray-700'>نوع النموذج:</label>
					<select
						value={settings.printMode}
						onChange={(e) => handleChange('printMode', e.target.value as 'study' | 'test')}
						className='border border-gray-300 rounded px-3 py-1 text-sm'
					>
						<option value='study'>نموذج الدراسة (سؤال + إجابة)</option>
						<option value='test'>نموذج الاختبار (أسئلة منفصلة)</option>
					</select>
				</div>

				<div className='border-t pt-4'>
					<h4 className='text-md font-medium mb-3 text-right'>اختيار الأسئلة</h4>

					<div className='space-y-3'>
						<div className='flex items-center'>
							<input
								type='radio'
								id='all-questions'
								name='question-selection'
								checked={settings.questionSelection.mode === 'all'}
								onChange={() => handleQuestionSelectionChange('all')}
								className='h-4 w-4 text-blue-600'
							/>
							<label htmlFor='all-questions' className='mr-2 text-sm'>
								جميع الأسئلة ({totalQuestions} سؤال)
							</label>
						</div>

						<div className='flex items-center'>
							<input
								type='radio'
								id='range-questions'
								name='question-selection'
								checked={settings.questionSelection.mode === 'range'}
								onChange={() =>
									handleQuestionSelectionChange('range', {
										from: 1,
										to: Math.min(10, totalQuestions),
									})
								}
								className='h-4 w-4 text-blue-600'
							/>
							<label htmlFor='range-questions' className='mr-2 text-sm'>
								نطاق من
							</label>
							{settings.questionSelection.mode === 'range' && (
								<div className='flex items-center space-x-2 space-x-reverse'>
									<input
										type='number'
										min='1'
										max={totalQuestions}
										value={settings.questionSelection.range?.from || 1}
										onChange={(e) =>
											handleQuestionSelectionChange('range', {
												from: parseInt(e.target.value),
												to:
													settings.questionSelection.range?.to ||
													Math.min(10, totalQuestions),
											})
										}
										className='w-16 border border-gray-300 rounded px-2 py-1 text-sm'
									/>
									<span className='text-sm'>إلى</span>
									<input
										type='number'
										min='1'
										max={totalQuestions}
										value={settings.questionSelection.range?.to || Math.min(10, totalQuestions)}
										onChange={(e) =>
											handleQuestionSelectionChange('range', {
												from: settings.questionSelection.range?.from || 1,
												to: parseInt(e.target.value),
											})
										}
										className='w-16 border border-gray-300 rounded px-2 py-1 text-sm'
									/>
								</div>
							)}
						</div>

						<div className='flex items-center'>
							<input
								type='radio'
								id='specific-questions'
								name='question-selection'
								checked={settings.questionSelection.mode === 'specific'}
								onChange={() => handleQuestionSelectionChange('specific', [1])}
								className='h-4 w-4 text-blue-600'
							/>
							<label htmlFor='specific-questions' className='mr-2 text-sm'>
								أسئلة محددة
							</label>
							{settings.questionSelection.mode === 'specific' && (
								<input
									type='text'
									value={specificInput}
									onChange={(e) => handleSpecificInputChange(e.target.value)}
									placeholder='مثال: 1, 5, 8, 9, 7'
									className='flex-1 border border-gray-300 rounded px-3 py-1 text-sm mr-2'
								/>
							)}
						</div>

						<div className='text-xs text-gray-500 bg-gray-50 p-2 rounded'>
							<p>
								عدد الأسئلة المختارة: <strong>{getSelectedQuestionsCount()}</strong> من {totalQuestions}
							</p>
						</div>
					</div>
				</div>

				{settings.printMode === 'test' && (
					<div className='border-t pt-4'>
						<h4 className='text-md font-medium mb-3 text-right'>إعدادات نموذج الاختبار</h4>

						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<label className='text-sm font-medium text-gray-700'>عدد الأسطر لكل إجابة:</label>
								<select
									value={settings.linesPerAnswer}
									onChange={(e) => handleChange('linesPerAnswer', Number(e.target.value) as number)}
									className='border border-gray-300 rounded px-3 py-1 text-sm'
								>
									<option value={2}>2 أسطر</option>
									<option value={3}>3 أسطر</option>
									<option value={4}>4 أسطر</option>
									<option value={5}>5 أسطر</option>
								</select>
							</div>

							<div className='flex items-center justify-between'>
								<label className='text-sm font-medium text-gray-700'>
									طباعة الإجابات في صفحة منفصلة:
								</label>
								<input
									type='checkbox'
									checked={settings.separateAnswerPage}
									onChange={(e) => handleChange('separateAnswerPage', e.target.checked)}
									className='h-4 w-4 text-blue-600'
								/>
							</div>

							<div className='flex items-center justify-between'>
								<label className='text-sm font-medium text-gray-700'>إظهار الإجابات في المعاينة:</label>
								<input
									type='checkbox'
									checked={settings.showAnswers}
									onChange={(e) => handleChange('showAnswers', e.target.checked)}
									className='h-4 w-4 text-blue-600'
								/>
							</div>
						</div>
					</div>
				)}

				<div className='text-xs text-gray-500 bg-gray-50 p-3 rounded'>
					<p className='mb-1'>
						<strong>نموذج الدراسة:</strong> يعرض السؤال والإجابة معاً للدراسة والمراجعة
					</p>
					<p>
						<strong>نموذج الاختبار:</strong> يعرض الأسئلة منفصلة عن الإجابات للاختبار الذاتي
					</p>
				</div>
			</div>
		</div>
	);
}
