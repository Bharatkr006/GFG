import type { Problem, LanguageConfig } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'cpp',
    label: 'C++ (17)',
    monacoLang: 'cpp',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    extension: 'cpp'
  },
  {
    id: 'cpp20',
    label: 'C++ (20)',
    monacoLang: 'cpp',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    extension: 'cpp'
  },
  {
    id: 'python',
    label: 'Python 3',
    monacoLang: 'python',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    extension: 'py'
  },
  {
    id: 'java',
    label: 'Java',
    monacoLang: 'java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    extension: 'java'
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    monacoLang: 'javascript',
    pistonLang: 'javascript',
    pistonVersion: '18.15.0',
    extension: 'js'
  }
];

export const PROBLEMS: Problem[] = [
  {
    id: 'smallest-subset-greater-sum',
    slug: 'smallest-subset-greater-sum',
    number: 1,
    title: 'Smallest Subset with Greater Sum',
    difficulty: 'Medium',
    accuracy: '85.64%',
    submissionsCount: '611+',
    points: 10,
    maxMarks: 10,
    descriptionHtml: `You are given an array <code class="code-inline">arr[]</code> containing non-negative integers. Your task is to select the minimum number of elements such that the sum of the selected elements is greater than the sum of the remaining elements in the array.`,
    descriptionText: `You are given an array arr[] containing non-negative integers. Your task is to select the minimum number of elements such that the sum of the selected elements is greater than the sum of the remaining elements in the array.`,
    examples: [
      {
        id: 1,
        input: `arr[] = [2, 17, 7, 3]`,
        output: `1`,
        explanation: `By selecting only the element 17, the sum of the remaining elements is 2 + 3 + 7 = 12, which is less than 17. Thus, the minimum number of elements required is 1.`
      },
      {
        id: 2,
        input: `arr[] = [20, 12, 18, 4]`,
        output: `2`,
        explanation: `By selecting 12 and 18, their sum becomes 12 + 18 = 30, which is greater than the sum of the remaining elements 20 + 4 = 24. Alternatively, selecting 20 and 18 would also satisfy the condition. Thus, the minimum number of elements required is 2.`
      },
      {
        id: 3,
        input: `arr[] = [1, 1, 1, 1, 10]`,
        output: `1`,
        explanation: `Selecting only the element 10 gives a sum of 10, which is greater than the sum of the remaining elements (1 + 1 + 1 + 1 = 4). Therefore, the minimum number of elements required is 1.`
      }
    ],
    moreExamples: [
      {
        id: 4,
        input: `arr[] = [5, 3, 1, 8, 4, 2]`,
        output: `2`,
        explanation: `Total sum is 23. Half of it is 11.5. Selecting 8 and 5 gives 13 > 10, requiring 2 elements.`
      }
    ],
    constraints: [
      '1 <= arr.size() <= 10^5',
      '1 <= arr[i] <= 10^4'
    ],
    editorial: {
      approach: 'Greedy with Sorting',
      algorithm: 'Sort the array in ascending order. Calculate the total sum of all elements. Traverse from the right (largest elements) while accumulating their sum. The first time this running sum strictly exceeds half of the total sum, the count of elements picked so far is the minimum required.',
      timeComplexity: 'O(N log N) where N is the size of the array due to sorting.',
      spaceComplexity: 'O(1) auxiliary space (or O(N) depending on sort implementation).'
    },
    testCases: [
      {
        id: 1,
        input: `4\n2 17 7 3`,
        expectedOutput: `1`,
        isSample: true,
        explanation: `17 is greater than 2+3+7=12`
      },
      {
        id: 2,
        input: `4\n20 12 18 4`,
        expectedOutput: `2`,
        isSample: true,
        explanation: `18+12=30 > 20+4=24`
      },
      {
        id: 3,
        input: `5\n1 1 1 1 10`,
        expectedOutput: `1`,
        isSample: true,
        explanation: `10 > 1+1+1+1=4`
      },
      {
        id: 4,
        input: `6\n5 3 1 8 4 2`,
        expectedOutput: `2`,
        isSample: false
      }
    ],
    starterTemplates: {
      cpp: `class Solution {
    public:
    int minSubset(vector<int> &arr) {
        // code here
    }
};`,
      cpp20: `class Solution {
    public:
    int minSubset(vector<int> &arr) {
        // code here
    }
};`,
      python: `class Solution:
    def minSubset(self, arr: list[int]) -> int:
        # code here
        pass`,
      java: `class Solution {
    public int minSubset(int[] arr) {
        // code here
        return 0;
    }
}`,
      javascript: `class Solution {
    minSubset(arr) {
        // code here
        return 0;
    }
}`
    }
  },
  {
    id: 'insert-interval',
    slug: 'insert-interval',
    number: 2,
    title: 'Insert Interval',
    difficulty: 'Medium',
    accuracy: '84.93%',
    submissionsCount: '548+',
    points: 30,
    maxMarks: 30,
    descriptionHtml: `Geek has a set of non-overlapping intervals, initially sorted based on their start times. You are given a new interval <code class="code-inline">newInterval</code>, your task is to insert <code class="code-inline">newInterval</code> into the intervals (merge overlapping intervals if necessary) such that the intervals remain sorted and non-overlapping.`,
    descriptionText: `Geek has a set of non-overlapping intervals, initially sorted based on their start times. You are given a new interval newInterval, your task is to insert newInterval into the intervals (merge overlapping intervals if necessary) such that the intervals remain sorted and non-overlapping.`,
    examples: [
      {
        id: 1,
        input: `intervals = [[1, 3], [6, 9]], newInterval = [2, 5]`,
        output: `[[1, 5], [6, 9]]`,
        explanation: `Because the new interval [2, 5] overlaps with [1, 3], they merge into [1, 5].`
      },
      {
        id: 2,
        input: `intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]`,
        output: `[[1, 2], [3, 10], [12, 16]]`,
        explanation: `Because the new interval [4, 8] overlaps with [3, 5], [6, 7], and [8, 10], merge them into [3, 10].`
      }
    ],
    moreExamples: [
      {
        id: 3,
        input: `intervals = [], newInterval = [5, 7]`,
        output: `[[5, 7]]`,
        explanation: `The initial list is empty, so output contains just the new interval.`
      }
    ],
    constraints: [
      '0 <= intervals.size() <= 10^5',
      'intervals[i].size() == 2',
      '0 <= start <= end <= 10^9'
    ],
    editorial: {
      approach: 'Linear Scan & Merge',
      algorithm: 'Iterate through intervals: 1. Add all intervals ending before newInterval starts. 2. Merge all intervals overlapping with newInterval by updating start to min(start, interval.start) and end to max(end, interval.end). 3. Add the merged newInterval. 4. Add all remaining intervals.',
      timeComplexity: 'O(N) single pass through the intervals list.',
      spaceComplexity: 'O(N) to store the result intervals.'
    },
    testCases: [
      {
        id: 1,
        input: `2 2 5\n1 3\n6 9`,
        expectedOutput: `[[1, 5], [6, 9]]`,
        isSample: true
      },
      {
        id: 2,
        input: `5 4 8\n1 2\n3 5\n6 7\n8 10\n12 16`,
        expectedOutput: `[[1, 2], [3, 10], [12, 16]]`,
        isSample: true
      }
    ],
    starterTemplates: {
      cpp: `class Solution {
    public:
    vector<vector<int>> insertInterval(vector<vector<int>> &intervals, vector<int> &newInterval) {
        // code here
    }
};`,
      cpp20: `class Solution {
    public:
    vector<vector<int>> insertInterval(vector<vector<int>> &intervals, vector<int> &newInterval) {
        // code here
    }
};`,
      python: `class Solution:
    def insertInterval(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        # code here
        pass`,
      java: `class Solution {
    public int[][] insertInterval(int[][] intervals, int[] newInterval) {
        // code here
        return new int[0][0];
    }
}`,
      javascript: `class Solution {
    insertInterval(intervals, newInterval) {
        // code here
        return [];
    }
}`
    }
  },
  {
    id: 'subarray-sum-divisible-by-k',
    slug: 'subarray-sum-divisible-by-k',
    number: 3,
    title: 'Subarray Sum Divisible By K',
    difficulty: 'Medium',
    accuracy: '65.87%',
    submissionsCount: '751+',
    points: 30,
    maxMarks: 30,
    descriptionHtml: `You are given an integer array <code class="code-inline">arr[]</code> and a value <code class="code-inline">k</code>. The task is to find the count of all non-empty subarrays whose sum is divisible by <code class="code-inline">k</code>.`,
    descriptionText: `You are given an integer array arr[] and a value k. The task is to find the count of all non-empty subarrays whose sum is divisible by k.`,
    examples: [
      {
        id: 1,
        input: `arr[] = [4, 5, 0, -2, -3, 1], k = 5`,
        output: `7`,
        explanation: `There are 7 subarrays with a sum divisible by k = 5: [4, 5, 0, -2, -3, 1], [5], [5, 0], [5, 0, -2, -3], [0], [0, -2, -3], [-2, -3]`
      },
      {
        id: 2,
        input: `arr[] = [5], k = 9`,
        output: `0`,
        explanation: `There is only one subarray [5], whose sum is not divisible by 9.`
      }
    ],
    moreExamples: [
      {
        id: 3,
        input: `arr[] = [2, -2, 2, -4], k = 6`,
        output: `2`,
        explanation: `Subarrays [2, -2] and [-2, 2] both sum to 0 which is divisible by 6.`
      }
    ],
    constraints: [
      '1 <= arr.size() <= 3 * 10^4',
      '-10^4 <= arr[i] <= 10^4',
      '2 <= k <= 10^4'
    ],
    editorial: {
      approach: 'Prefix Sum Modulo with Hash Map / Array',
      algorithm: 'Maintain a running prefix sum and calculate its remainder modulo k (normalized: ((sum % k) + k) % k). Use a frequency map of seen remainders with remainder 0 initialized to 1. Each time remainder r is observed, add map[r] to total count.',
      timeComplexity: 'O(N) single pass over array.',
      spaceComplexity: 'O(min(N, K)) to store remainder frequencies.'
    },
    testCases: [
      {
        id: 1,
        input: `6 5\n4 5 0 -2 -3 1`,
        expectedOutput: `7`,
        isSample: true
      },
      {
        id: 2,
        input: `1 9\n5`,
        expectedOutput: `0`,
        isSample: true
      }
    ],
    starterTemplates: {
      cpp: `class Solution {
    public:
    int subCount(vector<int> &arr, int k) {
        // code here
    }
};`,
      cpp20: `class Solution {
    public:
    int subCount(vector<int> &arr, int k) {
        // code here
    }
};`,
      python: `class Solution:
    def subCount(self, arr: list[int], k: int) -> int:
        # code here
        pass`,
      java: `class Solution {
    public int subCount(int[] arr, int k) {
        // code here
        return 0;
    }
}`,
      javascript: `class Solution {
    subCount(arr, k) {
        // code here
        return 0;
    }
}`
    }
  },
  {
    id: 'median-in-stream',
    slug: 'median-in-stream',
    number: 4,
    title: 'Median in Stream',
    difficulty: 'Medium',
    accuracy: '74.98%',
    submissionsCount: '524+',
    points: 30,
    maxMarks: 30,
    descriptionHtml: `Given a data stream <code class="code-inline">arr[]</code> where integers are read sequentially, find the median of the elements encountered so far after each new integer is read.<br/><br/>The median is defined as follows:<br/>• Odd number of elements: The median is the middle element when the current set of numbers is sorted.<br/>• Even number of elements: The median is the arithmetic mean (average) of the two middle elements when the current set of numbers is sorted.`,
    descriptionText: `Given a data stream arr[] where integers are read sequentially, find the median of the elements encountered so far after each new integer is read.

The median is defined as follows:
• Odd number of elements: The median is the middle element when the current set of numbers is sorted.
• Even number of elements: The median is the arithmetic mean (average) of the two middle elements when the current set of numbers is sorted.`,
    examples: [
      {
        id: 1,
        input: `arr[] = [5, 15, 1, 3, 2, 8]`,
        output: `[5.0, 10.0, 5.0, 4.0, 3.0, 4.0]`,
        explanation: `After reading 1st element of stream - 5 -> median = 5.0
After reading 2nd element of stream - 5, 15 -> median = (5+15)/2 = 10.0
After reading 3rd element of stream - 5, 15, 1 -> median = 5.0
After reading 4th element of stream - 5, 15, 1, 3 -> median = (3+5)/2 = 4.0
After reading 5th element of stream - 5, 15, 1, 3, 2 -> median = 3.0
After reading 6th element of stream - 5, 15, 1, 3, 2, 8 -> median = (3+5)/2 = 4.0`
      },
      {
        id: 2,
        input: `arr[] = [2, 2, 2, 2]`,
        output: `[2.0, 2.0, 2.0, 2.0]`,
        explanation: `All elements are identical (2), so median at every step is 2.0.`
      }
    ],
    moreExamples: [
      {
        id: 3,
        input: `arr[] = [1, 2, 3]`,
        output: `[1.0, 1.5, 2.0]`,
        explanation: `After 1: 1.0; after 1,2: 1.5; after 1,2,3: 2.0.`
      }
    ],
    constraints: [
      '1 <= arr.size() <= 10^5',
      '1 <= arr[i] <= 10^5'
    ],
    editorial: {
      approach: 'Two Heaps (Max-Heap & Min-Heap)',
      algorithm: 'Use a max-heap to store the smaller half of numbers and a min-heap to store the larger half. Maintain the invariant that max-heap size is either equal to min-heap size or has 1 more element. The median is either the top of max-heap (odd count) or average of tops of both heaps (even count).',
      timeComplexity: 'O(N log N) since each insertion takes O(log N).',
      spaceComplexity: 'O(N) to store elements in the two heaps.'
    },
    testCases: [
      {
        id: 1,
        input: `6\n5 15 1 3 2 8`,
        expectedOutput: `[5.0, 10.0, 5.0, 4.0, 3.0, 4.0]`,
        isSample: true
      },
      {
        id: 2,
        input: `4\n2 2 2 2`,
        expectedOutput: `[2.0, 2.0, 2.0, 2.0]`,
        isSample: true
      }
    ],
    starterTemplates: {
      cpp: `class Solution {
    public:
    vector<double> getMedian(vector<int> &arr) {
        // code here
    }
};`,
      cpp20: `class Solution {
    public:
    vector<double> getMedian(vector<int> &arr) {
        // code here
    }
};`,
      python: `class Solution:
    def getMedian(self, arr: list[int]) -> list[float]:
        # code here
        pass`,
      java: `class Solution {
    public double[] getMedian(int[] arr) {
        // code here
        return new double[0];
    }
}`,
      javascript: `class Solution {
    getMedian(arr) {
        // code here
        return [];
    }
}`
    }
  }
];
