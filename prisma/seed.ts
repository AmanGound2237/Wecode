import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`[Seed] Commencing Database Injection Sequence...`);

  // ============================================================================
  // 1. ADMIN USER SEEDING
  // ============================================================================
  const adminEmail = "krishmannadal@gmail.com";
  const rawPassword = "C#@ngethatineedtobe";

  console.log(`[Seed] 1. Initializing Lead Admin: ${adminEmail}...`);
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: passwordHash },
    create: {
      email: adminEmail,
      name: "Lead Admin",
      passwordHash: passwordHash,
    },
  });

  // ============================================================================
  // 2. TOPICS SEEDING
  // ============================================================================
  console.log(`[Seed] 2. Seeding AI/ML Topics...`);
  const topicsData = [
    {
      slug: "math-fundamentals",
      title: "Math Fundamentals",
      category: "Mathematics",
      summary: "Core linear algebra and calculus required for Machine Learning.",
      theory: "Understanding vectors, matrices, distances, and basic derivatives.",
      videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
    },
    {
      slug: "data-processing",
      title: "Data Processing",
      category: "Data Science",
      summary: "Techniques for preparing unrefined data for ML models.",
      theory: "Scaling, encoding, and manipulating categorical/numerical data.",
      videoUrl: "https://www.youtube.com/watch?v=0F5oW6bP8vY",
    },
    {
      slug: "classic-ml",
      title: "Classic Machine Learning",
      category: "Machine Learning",
      summary: "Core algorithms like K-Means, Linear Regression, and KNN.",
      theory: "Supervised and unsupervised foundational concepts and metrics.",
      videoUrl: "https://www.youtube.com/watch?v=KNAWp2S3w94",
    },
    {
      slug: "deep-learning",
      title: "Deep Learning Foundations",
      category: "Neural Networks",
      summary: "Building blocks of Neural Networks: Activations, Layers, and Backprop.",
      theory: "Neurons, forward propagation, loss functions, and gradients.",
      videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    },
    {
      slug: "nlp-transformers",
      title: "NLP & Transformers",
      category: "Modern AI",
      summary: "Processing text and implementing the Attention Mechanism.",
      theory: "Embeddings, TF-IDF, RNNs, and Multi-Head Self Attention.",
      videoUrl: "https://www.youtube.com/watch?v=wjZofJX0v4M",
    },
  ];

  for (const t of topicsData) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  // Fetch topics to map them by slug for the problems
  const dbTopics = await prisma.topic.findMany();
  const topicMap = dbTopics.reduce((acc, topic) => {
    acc[topic.slug] = topic.id;
    return acc;
  }, {} as Record<string, string>);

  // ============================================================================
  // 3. PROBLEMS SEEDING (30 Problems: 10 Easy, 10 Medium, 10 Hard)
  // ============================================================================
  console.log(`[Seed] 3. Seeding 30 Real-World AI Problems...`);

  const problemsData = [
    // --------------------------------------------------------------------------
    // EASY PROBLEMS (10)
    // --------------------------------------------------------------------------
    {
      slug: "matrix-addition",
      title: "Matrix Addition",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.EASY,
      summary: "Compute the element-wise sum of two matrices.",
      tags: ["linear-algebra", "math"],
      prompt: `Write a function that takes two 2D lists \`A\` and \`B\` of the same dimensions and returns their element-wise sum.\n\n### Formula:\n$C_{i,j} = A_{i,j} + B_{i,j}$`,
      inputFormat: "matrix_a: List[List[float]], matrix_b: List[List[float]]",
      outputFormat: "List[List[float]]",
      constraints: ["1 <= rows, cols <= 100"],
      starterCode: `def solve(matrix_a, matrix_b):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 2], [3, 4]], [[5, 6], [7, 8]]`, output: `[[6, 8], [10, 12]]` }]
    },
    {
      slug: "vector-dot-product",
      title: "Vector Dot Product",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.EASY,
      summary: "Compute the dot product of two 1D vectors.",
      tags: ["linear-algebra", "math"],
      prompt: `Write a function that computes the inner dot product of two 1D vectors \`a\` and \`b\` of length $N$.\n\n### Formula:\n$a \\cdot b = \\sum_{i=1}^{N} a_i b_i$`,
      inputFormat: "a: List[float], b: List[float]",
      outputFormat: "float",
      constraints: ["1 <= N <= 10^5"],
      starterCode: `def solve(a, b):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1, 2, 3], [4, 5, 6]`, output: `32` }]
    },
    {
      slug: "relu-activation",
      title: "ReLU Activation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.EASY,
      summary: "Implement the Rectified Linear Unit activation function.",
      tags: ["activation", "dl"],
      prompt: `Implement the ReLU activation function, which replaces all negative values in a 1D array with zero.\n\n### Formula:\n$f(x) = \\max(0, x)$`,
      inputFormat: "x: List[float]",
      outputFormat: "List[float]",
      constraints: ["1 <= len(x) <= 10^5"],
      starterCode: `def solve(x):\n    # Write your code here\n    pass`,
      examples: [{ input: `[-2.0, -1.0, 0.0, 1.0, 2.0]`, output: `[0.0, 0.0, 0.0, 1.0, 2.0]` }]
    },
    {
      slug: "sigmoid-activation",
      title: "Sigmoid Activation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.EASY,
      summary: "Map real numbers into the [0, 1] range using the logistic curve.",
      tags: ["activation", "dl"],
      prompt: `Implement the Sigmoid activation function for a 1D array of floats. For mathematical stability, you can assume inputs are bounded.\n\n### Formula:\n$\\sigma(x) = \\frac{1}{1 + e^{-x}}$`,
      inputFormat: "x: List[float]",
      outputFormat: "List[float]",
      constraints: ["1 <= len(x) <= 10^4", "math.exp is permitted"],
      starterCode: `import math\n\ndef solve(x):\n    # Write your code here\n    pass`,
      examples: [{ input: `[0.0, 100.0, -100.0]`, output: `[0.5, 1.0, 0.0]` }]
    },
    {
      slug: "mean-squared-error",
      title: "Mean Squared Error",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.EASY,
      summary: "Calculate the MSE loss between predictions and ground truth.",
      tags: ["loss", "metrics"],
      prompt: `Compute the Mean Squared Error (MSE) between two arrays: \`y_true\` and \`y_pred\`.\n\n### Formula:\n$MSE = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2$`,
      inputFormat: "y_true: List[float], y_pred: List[float]",
      outputFormat: "float",
      constraints: ["1 <= N <= 10^4", "len(y_true) == len(y_pred)"],
      starterCode: `def solve(y_true, y_pred):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1.0, 2.0, 3.0], [1.0, 1.5, 3.5]`, output: `0.16666666666666666` }]
    },
    {
      slug: "binary-cross-entropy",
      title: "Binary Cross-Entropy Loss",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.EASY,
      summary: "Compute the BCE loss used for binary classification.",
      tags: ["loss", "dl"],
      prompt: `Compute the Binary Cross-Entropy loss between target labels $y$ (0 or 1) and predictions $p$ (probabilities between 0 and 1).\n\n### Formula:\n$BCE = -\\frac{1}{N} \\sum_{i=1}^{N} [y_i \\log(p_i) + (1 - y_i) \\log(1 - p_i)]$\n\n*Note: Clamp predictions to [1e-15, 1 - 1e-15] to prevent log(0).*`,
      inputFormat: "y_true: List[int], predictions: List[float]",
      outputFormat: "float",
      constraints: ["len(y_true) == len(predictions)"],
      starterCode: `import math\n\ndef solve(y_true, predictions):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1, 0, 1], [0.9, 0.1, 0.8]`, output: `0.14462152754328741` }]
    },
    {
      slug: "normalize-vector",
      title: "Normalize Vector (Min-Max scaled)",
      topicSlug: "data-processing",
      difficulty: Difficulty.EASY,
      summary: "Scale a vector strictly to the [0, 1] interval.",
      tags: ["preprocessing"],
      prompt: `Given a 1D vector of floats, apply min-max normalization to scale all values into the $[0, 1]$ range.\n\n### Formula:\n$x_{norm} = \\frac{x - x_{min}}{x_{max} - x_{min}}$\nIf $x_{max} = x_{min}$, return a vector of zeros.`,
      inputFormat: "x: List[float]",
      outputFormat: "List[float]",
      constraints: ["1 <= len(x)"],
      starterCode: `def solve(x):\n    # Write your code here\n    pass`,
      examples: [{ input: `[10.0, 20.0, 30.0]`, output: `[0.0, 0.5, 1.0]` }]
    },
    {
      slug: "euclidean-distance",
      title: "Euclidean Distance",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.EASY,
      summary: "Find the straight-line distance between two points in N-D space.",
      tags: ["math", "knn"],
      prompt: `Calculate the Euclidean distance between two N-dimensional points $P$ and $Q$.\n\n### Formula:\n$d = \\sqrt{\\sum_{i=1}^{N} (P_i - Q_i)^2}$`,
      inputFormat: "p: List[float], q: List[float]",
      outputFormat: "float",
      constraints: ["Lengths are equal"],
      starterCode: `import math\n\ndef solve(p, q):\n    # Write your code here\n    pass`,
      examples: [{ input: `[0, 0], [3, 4]`, output: `5.0` }]
    },
    {
      slug: "one-hot-encoding",
      title: "One-Hot Encoding",
      topicSlug: "data-processing",
      difficulty: Difficulty.EASY,
      summary: "Convert an array of class indices into one-hot vectors.",
      tags: ["preprocessing"],
      prompt: `Given an array of integer class labels \`y\` and the total number of classes \`K\`, convert it to a 2D matrix of shape \`(len(y), K)\` where each row has a 1 at the index of the class and 0s elsewhere.`,
      inputFormat: "y: List[int], K: int",
      outputFormat: "List[List[int]]",
      constraints: ["0 <= y[i] < K"],
      starterCode: `def solve(y, K):\n    # Write your code here\n    pass`,
      examples: [{ input: `[0, 2, 1], 3`, output: `[[1, 0, 0], [0, 0, 1], [0, 1, 0]]` }]
    },
    {
      slug: "tanh-activation",
      title: "Tanh Activation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.EASY,
      summary: "Map numbers to the [-1, 1] range using Hyperbolic Tangent.",
      tags: ["activation", "dl"],
      prompt: `Apply the Hyperbolic Tangent (Tanh) function to a 1D array. \n\n### Formula:\n$\\tanh(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}$`,
      inputFormat: "x: List[float]",
      outputFormat: "List[float]",
      constraints: ["Using math.tanh or custom exponentiation is allowed."],
      starterCode: `import math\n\ndef solve(x):\n    # Write your code here\n    pass`,
      examples: [{ input: `[0.0, 10.0]`, output: `[0.0, 1.0]` }]
    },

    // --------------------------------------------------------------------------
    // MEDIUM PROBLEMS (10)
    // --------------------------------------------------------------------------
    {
      slug: "kmeans-update-step",
      title: "K-Means Update Step",
      topicSlug: "classic-ml",
      difficulty: Difficulty.MEDIUM,
      summary: "Assign points to the nearest centroid and compute new centroids.",
      tags: ["classic-ml", "clustering"],
      prompt: `Implement one full iteration of the K-Means algorithm. Given \`X\` (2D array of points) and \`centroids\` (2D array of current centroids), do the following:\n1. Assign each point to the nearest centroid (Euclidean distance).\n2. Compute the new centroids as the mean of all assigned points.\n*If a centroid has no points, leave its coordinates unchanged.*`,
      inputFormat: "X: List[List[float]], centroids: List[List[float]]",
      outputFormat: "List[List[float]]",
      constraints: ["N points, K centroids, D dimensions"],
      starterCode: `def solve(X, centroids):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1,1], [2,2], [8,8], [9,9]], [[0,0], [10,10]]`, output: `[[1.5, 1.5], [8.5, 8.5]]` }]
    },
    {
      slug: "tfidf-calculation",
      title: "TF-IDF Calculation",
      topicSlug: "nlp-transformers",
      difficulty: Difficulty.MEDIUM,
      summary: "Compute Term Frequency - Inverse Document Frequency for documents.",
      tags: ["nlp", "preprocessing"],
      prompt: `Given a list of documents (strings), compute the TF-IDF matrix. \nUse $TF(t,d) = \\frac{\\text{count of t in d}}{\\text{total words in d}}$ and $IDF(t) = \\log_{10}(\\frac{N}{\\text{docs containing t}})$. Return an array of arrays representing the TF-IDF vector for each document based on the sorted vocabulary.`,
      inputFormat: "docs: List[str]",
      outputFormat: "List[List[float]]",
      constraints: ["Lowercase words, split by space.", "Return float matrix."],
      starterCode: `import math\n\ndef solve(docs):\n    # Write your code here\n    pass`,
      examples: [{ input: `["hello world", "hello user"]`, output: `[[0.0, 0.150514997], [0.0, 0.150514997]]` }] // Approximation
    },
    {
      slug: "softmax-function",
      title: "Softmax Activation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.MEDIUM,
      summary: "Convert a vector of raw logits into a probability distribution.",
      tags: ["dl", "activation"],
      prompt: `Implement the Softmax function for a 1D vector of logits. \n\n### Stability:\nTo prevent numerical overflow with $e^X$, subtract the maximum value of the vector from every element before exponentiation.\n\n### Formula:\n$S_i = \\frac{e^{x_i - \\max(x)}}{\\sum e^{x_j - \\max(x)}}$`,
      inputFormat: "logits: List[float]",
      outputFormat: "List[float]",
      constraints: ["Return normalized probabilities summing to 1"],
      starterCode: `import math\n\ndef solve(logits):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1.0, 2.0, 3.0]`, output: `[0.09003057, 0.24472847, 0.66524096]` }]
    },
    {
      slug: "simple-rnn-forward",
      title: "Simple RNN Cell Forward Pass",
      topicSlug: "deep-learning",
      difficulty: Difficulty.MEDIUM,
      summary: "Compute the hidden state for a single time step of an RNN.",
      tags: ["dl", "rnn"],
      prompt: `Compute the forward pass of a vanilla RNN cell for a single time step.\nInputs are $x_t$ (current input), $h_{t-1}$ (previous state).\nWeights are $W_x$ (input weight), $W_h$ (hidden weight), $b$ (bias).\n\n### Formula:\n$h_t = \\tanh(W_x \\cdot x_t + W_h \\cdot h_{t-1} + b)$`,
      inputFormat: "xt: List[float], ht_1: List[float], Wx: List[List[float]], Wh: List[List[float]], b: List[float]",
      outputFormat: "List[float]",
      constraints: ["Matrix multiplication required"],
      starterCode: `import math\n\ndef solve(xt, ht_1, Wx, Wh, b):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1.0], [0.0], [[0.5]], [[0.5]], [0.0]`, output: `[0.462117]` }]
    },
    {
      slug: "linear-regression-forward",
      title: "Linear Regression Forward",
      topicSlug: "classic-ml",
      difficulty: Difficulty.MEDIUM,
      summary: "Given weights and features, predict continuous outputs.",
      tags: ["regression", "math"],
      prompt: `Implement the prediction step of linear regression for a batch of $M$ samples with $N$ features.\n\n$X$ is a 2D matrix of shape $(M, N)$. \n$W$ is a 1D vector of length $N$ (weights).\n$b$ is a scalar bias.\nCompute $\\hat{y} = X \\cdot W + b$.`,
      inputFormat: "X: List[List[float]], W: List[float], b: float",
      outputFormat: "List[float]",
      constraints: ["M samples, N features"],
      starterCode: `def solve(X, W, b):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1.0, 2.0], [3.0, 4.0]], [0.5, 0.5], 1.0`, output: `[2.5, 4.5]` }]
    },
    {
      slug: "knn-inference",
      title: "K-Nearest Neighbors Inference",
      topicSlug: "classic-ml",
      difficulty: Difficulty.MEDIUM,
      summary: "Predict the label of a point using distance computing and voting.",
      tags: ["classification"],
      prompt: `Given a set of training points \`X_train\` and their labels \`y_train\`, predict the class for a new point \`query\` using KNN.\nFind the \`k\` points with minimum Euclidean distance to \`query\`. Return the most frequent label. If there's a tie, return the numerically smaller label.`,
      inputFormat: "X_train: List[List[float]], y_train: List[int], query: List[float], k: int",
      outputFormat: "int",
      constraints: ["len(X_train) >= k"],
      starterCode: `def solve(X_train, y_train, query, k):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[0], [1], [5], [6]], [0, 0, 1, 1], [4], 3`, output: `1` }]
    },
    {
      slug: "max-pooling-2d",
      title: "Max Pooling 2D",
      topicSlug: "deep-learning",
      difficulty: Difficulty.MEDIUM,
      summary: "Downsample an image representation using a window and max operation.",
      tags: ["cnn", "dl"],
      prompt: `Implement 2D Max Pooling on a single matrix (image) given a \`pool_size\` and \`stride\`. Assume the input dimensions perfectly divide the stride. Return smaller matrix constructed by taking the max of each sliding window.`,
      inputFormat: "image: List[List[float]], pool_size: int, stride: int",
      outputFormat: "List[List[float]]",
      constraints: ["Square images, valid padding only"],
      starterCode: `def solve(image, pool_size, stride):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]], 2, 2`, output: `[[6, 8], [14, 16]]` }]
    },
    {
      slug: "dropout-layer",
      title: "Dropout Layer Forward",
      topicSlug: "deep-learning",
      difficulty: Difficulty.MEDIUM,
      summary: "Simulate a forward pass with Dropout regularization.",
      tags: ["dl"],
      prompt: `Implement inverted dropout for an array of activations \`X\` with probability \`p\` (probability of dropping a neuron).\nUse a supplied array of \`random_floats\` (values between 0 and 1, length matches \`X\`) instead of generating randomness to ensure deterministic testing.\n\n### Rules:\n1. If \`rand[i] < p\`, the output is 0.\n2. Else, the output is \`X[i] / (1 - p)\` (inverted dropout scaling).`,
      inputFormat: "X: List[float], p: float, rand: List[float]",
      outputFormat: "List[float]",
      constraints: ["len(X) == len(rand)"],
      starterCode: `def solve(X, p, rand):\n    # Write your code here\n    pass`,
      examples: [{ input: `[10.0, 10.0], 0.5, [0.4, 0.6]`, output: `[0.0, 20.0]` }]
    },
    {
      slug: "leaky-relu",
      title: "Leaky ReLU Activation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.MEDIUM,
      summary: "Apply Leaky ReLU which retains a small gradient for negative inputs.",
      tags: ["activation"],
      prompt: `Implement Leaky ReLU. \nFormula: $f(x) = x$ if $x > 0$ else $f(x) = \\alpha \\times x$.\nReturn the transformed array.`,
      inputFormat: "X: List[float], alpha: float",
      outputFormat: "List[float]",
      constraints: ["alpha > 0"],
      starterCode: `def solve(X, alpha):\n    # Write your code here\n    pass`,
      examples: [{ input: `[-10.0, 0.0, 10.0], 0.1`, output: `[-1.0, 0.0, 10.0]` }]
    },
    {
      slug: "cosine-similarity",
      title: "Cosine Similarity",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.MEDIUM,
      summary: "Calculate the angle similarity between two vectors.",
      tags: ["math", "nlp"],
      prompt: `Calculate the Cosine Similarity between vectors \`A\` and \`B\`. \n\n### Formula:\n$S = \\frac{A \\cdot B}{||A|| \\times ||B||}$`,
      inputFormat: "A: List[float], B: List[float]",
      outputFormat: "float",
      constraints: ["Vector lengths match, > 0 magnitude"],
      starterCode: `import math\n\ndef solve(A, B):\n    # Write your code here\n    pass`,
      examples: [{ input: `[1.0, 0.0], [0.0, 1.0]`, output: `0.0` }]
    },


    // --------------------------------------------------------------------------
    // HARD PROBLEMS (10)
    // --------------------------------------------------------------------------
    {
      slug: "adam-optimizer-step",
      title: "Adam Optimizer Step",
      topicSlug: "math-fundamentals",
      difficulty: Difficulty.HARD,
      summary: "Implement one parameter update using the Adam optimizer.",
      tags: ["optimization"],
      prompt: `Implement a single weight update step for Adam.\nInputs: \`weight\`, \`gradient\`, \`m\` (1st moment), \`v\` (2nd moment), \`t\` (timestep), \`lr\` (learning rate), \`beta1\`, \`beta2\`, \`epsilon\`.\n\n### Equations:\n$m_t = \\beta_1 m_{t-1} + (1 - \\beta_1) g_t$\n$v_t = \\beta_2 v_{t-1} + (1 - \\beta_2) g_t^2$\n$\\hat{m}_t = m_t / (1 - \\beta_1^t)$\n$\\hat{v}_t = v_t / (1 - \\beta_2^t)$\n$w_t = w_{t-1} - lr \\times \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$\n\nReturn \`[new_weight, new_m, new_v]\`.`,
      inputFormat: "weight: float, gradient: float, m: float, v: float, t: int, lr: float, beta1: float, beta2: float, eps: float",
      outputFormat: "List[float]",
      constraints: ["Return array of 3 floats"],
      starterCode: `import math\n\ndef solve(weight, gradient, m, v, t, lr, beta1, beta2, eps):\n    # Write your code here\n    pass`,
      examples: [{ input: `0.5, 0.1, 0.0, 0.0, 1, 0.01, 0.9, 0.999, 1e-8`, output: `[0.49, 0.01, 0.000010]` }] // rounded visual
    },
    {
      slug: "multi-head-attention",
      title: "Multi-Head Self-Attention",
      topicSlug: "nlp-transformers",
      difficulty: Difficulty.HARD,
      summary: "Compute standard multi-head attention outputs given Q,K,V.",
      tags: ["transformers", "dl"],
      prompt: `You are given a query matrix \`Q\`, key matrix \`K\`, and value matrix \`V\` of shape(N, D_model). We split them into \`H\` heads. Perform the Dot-Product self-attention mechanism, concatenate the heads, and return the final matrix.\nAssume the matrices are already passed through the linear projections to arrive at Q, K, V.\n*Note: Softmax logic must be exact.*`,
      inputFormat: "Q: List[List[float]], K: List[List[float]], V: List[List[float]], H: int",
      outputFormat: "List[List[float]]",
      constraints: ["D_model is divisible by H", "No padding masks"],
      starterCode: `import math\n\ndef solve(Q, K, V, H):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 0], [0, 1]], [[1, 0], [0, 1]], [[2, 2], [3, 3]], 2`, output: `[[...], [...]]` }]
    },
    {
      slug: "dense-layer-backprop",
      title: "Dense Layer Backpropagation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.HARD,
      summary: "Compute the gradients dW, db, and dX for a fully connected layer.",
      tags: ["dl", "backprop"],
      prompt: `Given the upstream gradient \`dZ\` (shape M x Out), the original input \`X\` (shape M x In), and the dense layer weights \`W\` (shape In x Out), compute the gradients \\(dW\\) (for weights), \\(db\\) (for branch bias), and \\(dX\\) (to pass back to the previous layer). \n\nEquations:\n$dW = X^T \\cdot dZ$\n$db = \\text{sum}(dZ, \\text{axis}=0)$\n$dX = dZ \\cdot W^T$\n\nReturn \`[dW, db, dX]\`.`,
      inputFormat: "dZ: List[List[float]], X: List[List[float]], W: List[List[float]]",
      outputFormat: "List[Any]",
      constraints: ["Strict 2D Matrix multiplication necessary"],
      starterCode: `def solve(dZ, X, W):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1]], [[2]], [[3]]`, output: `[[[2]], [1], [[3]]]` }]
    },
    {
      slug: "2d-convolution",
      title: "2D Convolution Operation",
      topicSlug: "deep-learning",
      difficulty: Difficulty.HARD,
      summary: "Implement a strict 2D convolution forward pass from scratch.",
      tags: ["dl", "cnn"],
      prompt: `Write a function that calculates the 2D spatial convolution of an \`image\` (M x M) with a \`filter\` (F x F). No padding (VALID padding), Stride = 1.\nDo not use scipy or numpy. Use raw nested loops to compute the output matrix of dimension $(M - F + 1)$.`,
      inputFormat: "image: List[List[float]], kernel: List[List[float]]",
      outputFormat: "List[List[float]]",
      constraints: ["VALID padding", "STRIDE=1"],
      starterCode: `def solve(image, kernel):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1,1,1],[1,1,1],[1,1,1]], [[1,0],[0,1]]`, output: `[[2,2],[2,2]]` }]
    },
    {
      slug: "layer-normalization",
      title: "Layer Normalization",
      topicSlug: "nlp-transformers",
      difficulty: Difficulty.HARD,
      summary: "Normalize activations across the feature dimension.",
      tags: ["transformers"],
      prompt: `Implement Layer Normalization for a 2D matrix \`X\` (Batch x Features). \nFor each row, calculate mean and variance. Normalize the row to mean 0, variance 1. Then apply the learnable parameters \`gamma\` and \`beta\` (1D arrays of size Features). \nUse \`eps = 1e-5\` for numerical stability.\n\n$y_i = \\gamma \\times \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta$`,
      inputFormat: "X: List[List[float]], gamma: List[float], beta: List[float]",
      outputFormat: "List[List[float]]",
      constraints: ["Calculate mean and var per row."],
      starterCode: `import math\n\ndef solve(X, gamma, beta):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 3]], [1, 1], [0, 0]`, output: `[[-1.0, 1.0]]` }]
    },
    {
      slug: "batch-normalization",
      title: "Batch Normalization Forward",
      topicSlug: "deep-learning",
      difficulty: Difficulty.HARD,
      summary: "Normalize activations across the batch dimension.",
      tags: ["dl"],
      prompt: `Implement Batch Normalization for a 2D matrix \`X\` (Batch x Features). \nUnlike LayerNorm, compute the mean and variance for *each column* (feature) across the entire batch.\nNormalize the columns, multiply by \`gamma\`, add \`beta\`. \`eps = 1e-5\`.`,
      inputFormat: "X: List[List[float]], gamma: List[float], beta: List[float]",
      outputFormat: "List[List[float]]",
      constraints: ["Calculate mean/var along axis 0"],
      starterCode: `import math\n\ndef solve(X, gamma, beta):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 2], [3, 4]], [1, 1], [0, 0]`, output: `[[-1.0, -1.0], [1.0, 1.0]]` }]
    },
    {
      slug: "lstm-forward",
      title: "LSTM Cell Forward Pass",
      topicSlug: "deep-learning",
      difficulty: Difficulty.HARD,
      summary: "Compute the cell state and hidden state for Long Short-Term Memory.",
      tags: ["rnn", "dl"],
      prompt: `Calculate the outputs $h_t$ and $C_t$ for a single LSTM cell. \nInputs are $\\text{input}$ (concat of $x_t$ and $h_{t-1}$), matrix $W$ (shape [in, 4 * hidden]), bias $b$ (shape [4 * hidden]), and $C_{t-1}$.\nSplit the linear operation $Z = W \\cdot \\text{input} + b$ into four chunks to get the Forget, Input, Cell, and Output gates ($f, i, \\tilde{C}, o$).\nUse Sigmoid for $f, i, o$ and Tanh for $\\tilde{C}$.\n$C_t = f \\odot C_{t-1} + i \\odot \\tilde{C}$\n$h_t = o \\odot \\tanh(C_t)$`,
      inputFormat: "concat_x_h: List[float], W: List[List[float]], b: List[float], C_t_1: List[float]",
      outputFormat: "List[List[float]]",
      constraints: ["Return [h_t, C_t]"],
      starterCode: `import math\n\ndef solve(concat_x_h, W, b, C_t_1):\n    # Write your code here\n    pass`,
      examples: [{ input: `...`, output: `...` }]
    },
    {
      slug: "softmax-crossentropy-backward",
      title: "Softmax Cross-Entropy Backward",
      topicSlug: "deep-learning",
      difficulty: Difficulty.HARD,
      summary: "Compute the combined gradient for Softmax followed by Cross-Entropy loss.",
      tags: ["dl"],
      prompt: `In deep learning, calculating the local gradient of Softmax and Cross-Entropy separately is numerically unstable. Instead, the derivative of loss $L$ with respect to logits $Z$ is elegantly simple: \n\n$\\frac{\\partial L}{\\partial Z_i} = P_i - Y_i$\nwhere $P_i$ is the softmax probability and $Y_i$ is the one-hot encoded ground truth.\nGiven logits matrix \`Z\` and label vector \`y\`, return the gradient matrix \`dZ\`.`,
      inputFormat: "Z: List[List[float]], y: List[int]",
      outputFormat: "List[List[float]]",
      constraints: ["Z is matrix (Batch x Classes)"],
      starterCode: `import math\n\ndef solve(Z, y):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[0, 0, 0]], [0]`, output: `[[-0.6666, 0.3333, 0.3333]]` }]
    },
    {
      slug: "scaled-dot-product",
      title: "Scaled Dot-Product Attention",
      topicSlug: "nlp-transformers",
      difficulty: Difficulty.HARD,
      summary: "Implement the core math equation driving Transformers.",
      tags: ["transformers"],
      prompt: `Compute $Attention(Q, K, V) = \\text{softmax}(\\frac{Q K^T}{\\sqrt{d_k}}) V$.\nGiven \`Q\` (M x D), \`K\` (T x D), \`V\` (T x V_dim), compute the attention output. \`d_k\` is the dimension \`D\`.\nMake sure you accurately compute the softmax over the sequence dimension (rows of the similarity matrix).`,
      inputFormat: "Q: List[List[float]], K: List[List[float]], V: List[List[float]]",
      outputFormat: "List[List[float]]",
      constraints: ["Compute matrix multiplication exactly."],
      starterCode: `import math\n\ndef solve(Q, K, V):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 0]], [[1, 0], [0, 1]], [[10], [20]]`, output: `[[10.0]]` }] // simplified
    },
    {
      slug: "pca-transform",
      title: "Principal Component Transform",
      topicSlug: "classic-ml",
      difficulty: Difficulty.HARD,
      summary: "Find the covariance eigenvalues and project data to lower dims.",
      tags: ["math", "classic-ml"],
      prompt: `Implement full PCA projection on a dataset $X$. \n1. Center the data $X$.\n2. Compute the exact covariance matrix.\n3. Since computing eigenvectors from scratch in Python is complex without Numpy, you will be *provided* the Top-K eigenvectors \`eig_vecs\` as input.\n4. Project the centered data using $X_{center} \\cdot W$ and return $X_{reduced}$.`,
      inputFormat: "X: List[List[float]], eig_vecs: List[List[float]]",
      outputFormat: "List[List[float]]",
      constraints: ["Match linear projection shape."],
      starterCode: `def solve(X, eig_vecs):\n    # Write your code here\n    pass`,
      examples: [{ input: `[[1, 2], [3, 4]], [[0.707], [0.707]]`, output: `[[-1.414], [1.414]]` }]
    }
  ];

  for (const prob of problemsData) {
    const topicId = topicMap[prob.topicSlug];
    if (!topicId) throw new Error(`Topic ${prob.topicSlug} not found`);

    const tagData = prob.tags.map((t) => ({
      tag: {
        connectOrCreate: {
          where: { name: t },
          create: { name: t }
        }
      }
    }));

    const exampleData = prob.examples.map((ex, i) => ({
      input: ex.input,
      output: ex.output,
      order: i
    }));

    // Upsert the problem idempotently
    await prisma.problem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        summary: prob.summary,
        difficulty: prob.difficulty,
        prompt: prob.prompt,
        inputFormat: prob.inputFormat,
        outputFormat: prob.outputFormat,
        constraints: prob.constraints,
        starterCode: prob.starterCode,
        topicId: topicId,
        tags: {
          deleteMany: {},
          create: tagData
        },
        examples: {
          deleteMany: {},
          create: exampleData
        }
      },
      create: {
        slug: prob.slug,
        title: prob.title,
        summary: prob.summary,
        difficulty: prob.difficulty,
        prompt: prob.prompt,
        inputFormat: prob.inputFormat,
        outputFormat: prob.outputFormat,
        constraints: prob.constraints,
        starterCode: prob.starterCode,
        topicId: topicId,
        tags: { create: tagData },
        examples: { create: exampleData }
      }
    });

    console.log(`  + Injected: ${prob.title} [${prob.difficulty}]`);
  }

  console.log(`[Seed] SUCCESS: 30 ML Problems successfully injected!`);
  console.log(`[Seed] Database is ready for immediate deployment.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
