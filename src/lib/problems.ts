import type { ProblemDetail } from "@/lib/problem-types";

export const problems: ProblemDetail[] = [
  {
    slug: "gradient-descent-step",
    title: "Gradient Descent Step",
    summary: "Compute a single gradient descent update for a linear model.",
    difficulty: "Easy",
    tags: ["optimization", "linear-regression"],
    prompt:
      "Given weights w, bias b, a learning rate, and a batch of (x, y), compute a single gradient descent update using mean squared error. Return updated weights and bias.",
    inputFormat:
      "A list of feature vectors x, a list of labels y, initial weights w, bias b, and learning rate lr.",
    outputFormat: "The updated weights and bias.",
    constraints: [
      "2 <= len(x) <= 200",
      "1 <= len(x[0]) <= 10",
      "Use pure Python and numpy-free math.",
    ],
    starterCode: `def gradient_step(x, y, w, b, lr):
    """
    x: list[list[float]]
    y: list[float]
    w: list[float]
    b: float
    lr: float
    """
    # TODO: implement
    return w, b
  `,
    examples: [
      {
        input: "x = [[1.0, 2.0], [2.0, 1.0]], y = [3.0, 3.5], w = [0.5, -0.25], b = 0.1, lr = 0.1",
        output: "w = [0.61, -0.08], b = 0.29",
        explanation: "Compute gradients for w and b and apply w -= lr * grad_w, b -= lr * grad_b.",
      },
    ],
  },
  {
    slug: "confusion-matrix-metrics",
    title: "Confusion Matrix Metrics",
    summary: "Derive precision, recall, and F1 from a confusion matrix.",
    difficulty: "Easy",
    tags: ["metrics", "classification"],
    prompt:
      "You are given counts of true positives, false positives, true negatives, and false negatives. Compute precision, recall, and F1 score rounded to 4 decimals.",
    inputFormat: "tp, fp, tn, fn as integers.",
    outputFormat: "precision, recall, f1 as floats rounded to 4 decimals.",
    constraints: ["0 <= counts <= 10^6", "Avoid division by zero."],
    starterCode: `def classification_metrics(tp, fp, tn, fn):
    # TODO: implement
    return precision, recall, f1
  `,
    examples: [
      {
        input: "tp = 42, fp = 8, tn = 50, fn = 10",
        output: "precision = 0.84, recall = 0.8077, f1 = 0.8232",
      },
    ],
  },
  {
    slug: "token-windowing",
    title: "Token Windowing",
    summary: "Split tokens into fixed-size windows with overlap.",
    difficulty: "Medium",
    tags: ["nlp", "preprocessing"],
    prompt:
      "Given a list of tokens, a window size, and stride, return a list of windows. The last window should include remaining tokens even if shorter.",
    inputFormat: "tokens: list[str], window_size: int, stride: int",
    outputFormat: "list[list[str]]",
    constraints: ["1 <= window_size <= 128", "1 <= stride <= window_size"],
    starterCode: `def token_windows(tokens, window_size, stride):
    # TODO: implement
    return windows
  `,
    examples: [
      {
        input: "tokens = [a,b,c,d,e,f], window_size = 3, stride = 2",
        output: "[[a,b,c],[c,d,e],[e,f]]",
      },
    ],
  },
  {
    slug: "batchnorm-forward",
    title: "BatchNorm Forward",
    summary: "Implement the forward pass of batch normalization.",
    difficulty: "Medium",
    tags: ["deep-learning", "normalization"],
    prompt:
      "Given a batch of activations, compute normalized activations and return the batch mean and variance. Assume epsilon = 1e-5.",
    inputFormat: "batch: list[list[float]] (N x D)",
    outputFormat: "normalized: list[list[float]], mean: list[float], var: list[float]",
    constraints: ["2 <= N <= 256", "1 <= D <= 64"],
    starterCode: `def batchnorm_forward(batch):
    # TODO: implement
    return normalized, mean, var
  `,
    examples: [
      {
        input: "batch = [[1.0, 2.0], [3.0, 0.0]]",
        output: "normalized = [[-1.0, 1.0],[1.0,-1.0]], mean = [2.0, 1.0], var = [1.0, 1.0]",
      },
    ],
  },
  {
    slug: "kmeans-centroid-update",
    title: "K-Means Centroid Update",
    summary: "Recompute centroids from assignments.",
    difficulty: "Hard",
    tags: ["clustering", "unsupervised"],
    prompt:
      "Given points and cluster assignments, compute new centroids. If a cluster is empty, keep the previous centroid.",
    inputFormat:
      "points: list[list[float]], assignments: list[int], centroids: list[list[float]]",
    outputFormat: "updated centroids as list[list[float]]",
    constraints: ["1 <= k <= 10", "1 <= len(points) <= 2000"],
    starterCode: `def update_centroids(points, assignments, centroids):
    # TODO: implement
    return centroids
  `,
    examples: [
      {
        input: "points = [[1,2],[3,4],[10,10]], assignments = [0,0,1], centroids = [[0,0],[8,8]]",
        output: "[[2.0,3.0],[10.0,10.0]]",
      },
    ],
  },
];

