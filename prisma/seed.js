const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const topics = [
  {
    slug: "what-is-ml",
    title: "What is Machine Learning",
    category: "Machine Learning",
    summary: "Core idea of learning patterns from data instead of explicit rules.",
    theory:
      "Machine learning is about building systems that improve with data. Instead of hard-coding rules, we define a model, a loss that measures error, and an optimizer that updates model parameters. The workflow is: collect data, clean it, split into train/validation, train a model, and evaluate. The goal is generalization: good performance on new, unseen examples.",
    videoUrl: "https://www.youtube.com/watch?v=ZftI2fEz0Fw",
    tags: ["machine-learning"],
    generatePractice: false,
  },
  {
    slug: "types-of-ml",
    title: "Types of Machine Learning",
    category: "Machine Learning",
    summary: "Supervised, unsupervised, semi-supervised, and reinforcement learning.",
    theory:
      "Supervised learning uses labeled data to predict outputs. Unsupervised learning finds patterns or groups without labels. Semi-supervised learning mixes labeled and unlabeled data to improve accuracy. Reinforcement learning trains an agent to make decisions by rewarding good actions. Knowing the type helps you choose the right algorithms and evaluation metrics.",
    videoUrl: "https://www.youtube.com/watch?v=KNAWp2S3w94",
    tags: ["machine-learning"],
    generatePractice: false,
  },
  {
    slug: "missing-values",
    title: "Handling Missing Values",
    category: "Data Preprocessing",
    summary: "Impute, drop, or model missing data correctly.",
    theory:
      "Missing values can bias your model if handled poorly. Common strategies include dropping rows or columns, filling with mean/median/mode, or using more advanced imputation. The best choice depends on why values are missing and how much data is affected. Always track what you changed so you can reproduce it.",
    videoUrl: "https://www.youtube.com/watch?v=0F5oW6bP8vY",
    tags: ["preprocessing"],
    generatePractice: false,
  },
  {
    slug: "feature-scaling",
    title: "Feature Scaling",
    category: "Data Preprocessing",
    summary: "Normalize and standardize features for stable training.",
    theory:
      "Feature scaling makes features comparable in magnitude. Standardization centers features to mean 0 and standard deviation 1, while normalization scales to a fixed range like 0 to 1. Many models (SVM, KNN, gradient descent) train faster and perform better with scaled inputs.",
    videoUrl: "https://www.youtube.com/watch?v=6v7E7qzv2Qw",
    tags: ["preprocessing"],
    generatePractice: false,
  },
  {
    slug: "categorical-encoding",
    title: "Encoding Categorical Data",
    category: "Data Preprocessing",
    summary: "Convert categories into numeric form without losing meaning.",
    theory:
      "Models require numbers, so categories must be encoded. One-hot encoding creates binary columns for each category, while label encoding assigns integers. Use one-hot for nominal categories and label or ordinal encoding for ordered categories. Be mindful of the curse of dimensionality with high-cardinality features.",
    videoUrl: "https://www.youtube.com/watch?v=4Qp2oJ9yZtA",
    tags: ["preprocessing"],
    generatePractice: false,
  },
  {
    slug: "linear-regression",
    title: "Linear Regression",
    category: "Regression",
    summary: "Fit a straight line to data and interpret coefficients.",
    theory:
      "Linear regression fits a straight line that explains how inputs relate to outputs. Predictions are a weighted sum of features. We measure error with mean squared error and update weights with gradient descent or a closed-form solution. Coefficients indicate how each feature influences the target.",
    videoUrl: "https://www.youtube.com/watch?v=8jazNUpO3lQ",
    tags: ["linear-regression", "regression"],
    generatePractice: true,
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    category: "Optimization",
    summary: "Iteratively reduce loss by moving against the gradient.",
    theory:
      "Gradient descent updates model parameters in the direction that reduces loss. The learning rate controls step size. Too large can diverge; too small slows learning. Variants like SGD and Adam add noise or adaptive steps to improve convergence.",
    videoUrl: "https://www.youtube.com/watch?v=sDv4f4s2SB8",
    tags: ["optimization"],
    generatePractice: false,
  },
  {
    slug: "logistic-regression",
    title: "Logistic Regression",
    category: "Classification",
    summary: "Predict class probabilities with a sigmoid function.",
    theory:
      "Logistic regression models the probability of a class using a sigmoid. It minimizes log loss and outputs probabilities that can be thresholded. It is simple, interpretable, and often the best first classifier to try.",
    videoUrl: "https://www.youtube.com/watch?v=VCJdg7YBbAQ",
    tags: ["logistic-regression", "classification"],
    generatePractice: true,
  },
  {
    slug: "knn",
    title: "K-Nearest Neighbors",
    category: "Classification",
    summary: "Predict labels based on nearest data points.",
    theory:
      "KNN predicts a label by looking at the k closest points in feature space. It is simple and non-parametric, but can be slow on large datasets. Feature scaling is critical because distance is the core operation.",
    videoUrl: "https://www.youtube.com/watch?v=HVXime0nQeI",
    tags: ["knn", "classification"],
    generatePractice: false,
  },
  {
    slug: "naive-bayes",
    title: "Naive Bayes",
    category: "Classification",
    summary: "Use Bayes rule with independence assumptions.",
    theory:
      "Naive Bayes uses Bayes rule to compute class probabilities assuming features are independent. This assumption is often false, but the model still performs well on text. It is fast, robust, and a strong baseline for classification.",
    videoUrl: "https://www.youtube.com/watch?v=O2L2Uv9pdDA",
    tags: ["naive-bayes", "classification"],
    generatePractice: false,
  },
  {
    slug: "decision-trees",
    title: "Decision Trees",
    category: "Tree-Based Models",
    summary: "Split data by features to form interpretable rules.",
    theory:
      "Decision trees split data by feature thresholds to maximize purity. They are easy to interpret and capture non-linear rules. They can overfit, so control depth, min samples, or prune the tree.",
    videoUrl: "https://www.youtube.com/watch?v=qDcl-FRnwSU",
    tags: ["decision-tree", "classification"],
    generatePractice: false,
  },
  {
    slug: "random-forest",
    title: "Random Forest",
    category: "Tree-Based Models",
    summary: "Ensemble of trees to reduce variance.",
    theory:
      "Random Forest builds many trees on bootstrapped data and averages predictions. It reduces variance, improves stability, and provides feature importance. It is a strong default for tabular data.",
    videoUrl: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ",
    tags: ["random-forest", "ensemble"],
    generatePractice: false,
  },
  {
    slug: "k-means",
    title: "K-Means Clustering",
    category: "Unsupervised Learning",
    summary: "Group points into k clusters using centroid updates.",
    theory:
      "K-Means clusters data by repeating assignment and centroid update steps. It is fast and easy to implement but sensitive to initialization. Use k-means++ or multiple restarts for better results.",
    videoUrl: "https://www.youtube.com/watch?v=4b5d3muPQmA",
    tags: ["k-means", "clustering"],
    generatePractice: true,
  },
  {
    slug: "dbscan",
    title: "DBSCAN",
    category: "Unsupervised Learning",
    summary: "Find clusters based on density rather than centroid distance.",
    theory:
      "DBSCAN groups points that are densely packed and labels sparse points as outliers. It finds clusters of arbitrary shape and does not require choosing k. The main parameters are epsilon (radius) and minPts (minimum points).",
    videoUrl: "https://www.youtube.com/watch?v=RDZUdRSDOok",
    tags: ["dbscan", "clustering"],
    generatePractice: false,
  },
  {
    slug: "pca",
    title: "PCA",
    category: "Dimensionality Reduction",
    summary: "Reduce dimensionality while keeping the most variance.",
    theory:
      "PCA finds directions of maximum variance and projects data onto them. This reduces dimensions, helps visualization, and can speed up models. The explained variance ratio tells you how much information each component preserves.",
    videoUrl: "https://www.youtube.com/watch?v=HMOI_lkzW08",
    tags: ["pca", "dimensionality-reduction"],
    generatePractice: true,
  },
  {
    slug: "confusion-matrix",
    title: "Confusion Matrix",
    category: "Model Evaluation",
    summary: "Break down predictions into TP, FP, TN, FN.",
    theory:
      "A confusion matrix counts true positives, false positives, true negatives, and false negatives. It helps you diagnose the types of errors a model makes. From it you can compute accuracy, precision, recall, and F1 score.",
    videoUrl: "https://www.youtube.com/watch?v=Kdsp6soqA7o",
    tags: ["metrics"],
    generatePractice: false,
  },
  {
    slug: "roc-curve",
    title: "ROC Curve",
    category: "Model Evaluation",
    summary: "Visualize the tradeoff between TPR and FPR.",
    theory:
      "ROC curves plot true positive rate against false positive rate across thresholds. The area under the curve (AUC) summarizes model separability. ROC is useful for imbalanced data when you care about ranking quality.",
    videoUrl: "https://www.youtube.com/watch?v=gdW6hj9IXaA",
    tags: ["metrics"],
    generatePractice: false,
  },
  {
    slug: "nn-basics",
    title: "Neural Networks Basics",
    category: "Deep Learning",
    summary: "Understand neurons, layers, and backpropagation.",
    theory:
      "Neural networks combine layers of linear transformations and non-linear activations. Training uses backpropagation to compute gradients and an optimizer to update weights. Depth helps learn complex functions, but requires good initialization and regularization.",
    videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    tags: ["neural-networks"],
    generatePractice: false,
  },
  {
    slug: "cnn",
    title: "CNN",
    category: "Deep Learning",
    summary: "Extract spatial patterns with convolution filters.",
    theory:
      "CNNs use convolution filters to learn spatial features like edges and textures. Pooling reduces size and helps invariance. Deeper layers combine simple features into complex patterns. CNNs are fundamental for image tasks.",
    videoUrl: "https://www.youtube.com/watch?v=YRhxdVk_sIs",
    tags: ["cnn", "deep-learning"],
    generatePractice: true,
  },
  {
    slug: "rnn",
    title: "RNN",
    category: "Deep Learning",
    summary: "Model sequences with hidden states.",
    theory:
      "RNNs process sequences by updating a hidden state over time. This captures order information in text or time series. Vanilla RNNs struggle with long dependencies; LSTM and GRU address this with gating.",
    videoUrl: "https://www.youtube.com/watch?v=AsNTP8Kwu80",
    tags: ["rnn", "deep-learning"],
    generatePractice: false,
  },
  {
    slug: "attention",
    title: "Attention Mechanism",
    category: "Modern AI",
    summary: "Let models focus on the most relevant parts of input.",
    theory:
      "Attention computes weighted combinations of values based on similarity between queries and keys. It lets models focus on relevant tokens instead of compressing everything into one vector. Attention is the core of transformers and modern NLP models.",
    videoUrl: "https://www.youtube.com/watch?v=4Bdc55j80l8",
    tags: ["attention", "transformers"],
    generatePractice: false,
  },
  {
    slug: "transformers",
    title: "Transformers",
    category: "Modern AI",
    summary: "Self-attention models that scale to large data.",
    theory:
      "Transformers use self-attention so every token can see every other token. This makes long-range dependencies easier to learn and allows parallel training. Transformers power most state-of-the-art NLP and many vision systems.",
    videoUrl: "https://www.youtube.com/watch?v=wjZofJX0v4M",
    tags: ["transformers", "nlp"],
    generatePractice: false,
  },
  {
    slug: "tf-idf",
    title: "TF-IDF",
    category: "NLP",
    summary: "Weight terms by frequency and rarity.",
    theory:
      "TF-IDF scales word counts by how common a word is across documents. Frequent words within a document get higher weight, while words that appear in many documents get lower weight. This provides a simple, strong baseline for text classification.",
    videoUrl: "https://www.youtube.com/watch?v=4vTz7U4fPqM",
    tags: ["nlp", "tf-idf"],
    generatePractice: false,
  },
  {
    slug: "word2vec",
    title: "Word2Vec",
    category: "NLP",
    summary: "Learn dense word embeddings from context.",
    theory:
      "Word2Vec learns vector representations of words by predicting neighbors. Similar words end up with similar vectors. It captures semantic relationships and is widely used for downstream NLP tasks.",
    videoUrl: "https://www.youtube.com/watch?v=ERibwqs9p38",
    tags: ["nlp", "embeddings"],
    generatePractice: false,
  },
  {
    slug: "yolo",
    title: "Object Detection (YOLO)",
    category: "Computer Vision",
    summary: "Detect objects in images in a single forward pass.",
    theory:
      "YOLO treats object detection as a regression problem. It predicts bounding boxes and class probabilities in one pass, making it fast for real-time use. It is popular for surveillance, robotics, and edge devices.",
    videoUrl: "https://www.youtube.com/watch?v=MpU2bIHt9wA",
    tags: ["computer-vision", "object-detection"],
    generatePractice: false,
  },
  {
    slug: "fastapi-deploy",
    title: "FastAPI ML Deployment",
    category: "Deployment",
    summary: "Serve ML models as APIs using FastAPI.",
    theory:
      "FastAPI lets you expose ML models as REST APIs with minimal code. You define input/output schemas, load the model once at startup, and return predictions. It is fast, typed, and ideal for production prototypes.",
    videoUrl: "https://www.youtube.com/watch?v=7t2alSnE2-I",
    tags: ["deployment", "fastapi"],
    generatePractice: false,
  },
];

const toEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);
    const id = parsed.searchParams.get("v");
    const list = parsed.searchParams.get("list");
    const index = parsed.searchParams.get("index");

    if (!id) {
      return url;
    }

    const params = new URLSearchParams();
    if (list) {
      params.set("list", list);
    }
    if (index) {
      params.set("index", index);
    }

    const query = params.toString();
    return `https://www.youtube.com/embed/${id}${query ? `?${query}` : ""}`;
  } catch (error) {
    return url;
  }
};

const variants = [
  { label: "A", size: "small", n: 6 },
  { label: "B", size: "medium", n: 20 },
];

const baseTasks = {
  "linear-regression": {
    easy: [
      "Compute predictions for a batch",
      "Compute mean squared error",
      "Compute residuals",
      "Normalize a single feature",
      "Add bias term to features",
      "Compute R-squared",
      "Compute gradient for weights",
      "Compute gradient for bias",
      "Apply one gradient descent step",
      "Standardize features with mean/variance",
    ],
    medium: [
      "Train for k steps of gradient descent",
      "Implement mini-batch gradient descent",
      "Compute closed-form solution (normal equation)",
      "Add L2 regularization term",
      "Add L1 regularization term",
      "Implement early stopping based on loss",
      "Compute learning curve values",
      "Build polynomial features of degree 2",
      "Split data into train/test deterministically",
      "Compute MAE and RMSE",
    ],
    hard: [
      "Solve multi-output linear regression",
      "Implement gradient checking",
      "Handle missing values with mean imputation",
      "Implement robust regression with Huber loss",
      "Compute confidence intervals for weights",
      "Detect multicollinearity via condition number",
      "Implement elastic net update",
      "Standardize and invert predictions",
      "Optimize learning rate schedule",
      "Implement batch normalization for inputs",
    ],
  },
  "logistic-regression": {
    easy: [
      "Compute sigmoid for a vector",
      "Compute logits from weights",
      "Compute binary predictions with threshold",
      "Compute log loss for a batch",
      "Compute accuracy",
      "Compute precision and recall",
      "Compute gradient for weights",
      "Compute gradient for bias",
      "Apply one gradient descent step",
      "Normalize inputs to [0,1]",
    ],
    medium: [
      "Train for k steps of gradient descent",
      "Implement L2-regularized log loss",
      "Implement class-weighted loss",
      "Compute ROC-AUC from scores",
      "Compute confusion matrix",
      "Implement early stopping by validation loss",
      "Perform stratified train/test split",
      "Add polynomial features",
      "Compute calibration error",
      "Implement mini-batch training",
    ],
    hard: [
      "Implement one-vs-rest multi-class",
      "Compute softmax probabilities",
      "Implement Newton-Raphson update",
      "Handle class imbalance with focal loss",
      "Compute PR-AUC",
      "Implement threshold tuning for F1",
      "Add L1 regularization update",
      "Implement probability clipping",
      "Compute log-loss with numeric stability",
      "Gradient check logistic regression",
    ],
  },
  "k-means": {
    easy: [
      "Compute Euclidean distance matrix",
      "Assign points to nearest centroid",
      "Update centroids from assignments",
      "Compute within-cluster sum of squares",
      "Handle empty cluster fallback",
      "Initialize centroids from points",
      "Compute cluster sizes",
      "Normalize input points",
      "Compute centroid movement",
      "Stop when centroids converge",
    ],
    medium: [
      "Run k-means for k iterations",
      "Implement k-means++ initialization",
      "Compute silhouette score",
      "Reassign clusters with Manhattan distance",
      "Compute inertia for multiple k",
      "Implement mini-batch k-means",
      "Detect convergence by inertia",
      "Scale features and rerun",
      "Cluster with weighted features",
      "Compute cluster purity",
    ],
    hard: [
      "Implement bisecting k-means",
      "Handle high-dimensional sparse inputs",
      "Run k-means with cosine similarity",
      "Accelerate using triangle inequality",
      "Compare k-means with k-medoids",
      "Detect outliers with distance threshold",
      "Compute Davies-Bouldin index",
      "Implement k-means on streaming data",
      "Enforce minimum cluster size",
      "Optimize k selection with elbow method",
    ],
  },
  "pca": {
    easy: [
      "Center the dataset",
      "Compute covariance matrix",
      "Compute eigenvalues of 2x2 matrix",
      "Sort components by variance",
      "Project data onto 1D",
      "Reconstruct from 1D projection",
      "Compute explained variance ratio",
      "Normalize features before PCA",
      "Compute top-k components",
      "Measure reconstruction error",
    ],
    medium: [
      "Implement PCA with SVD",
      "Whiten data after PCA",
      "Compute cumulative variance",
      "Select k for 95% variance",
      "Apply PCA to image patches",
      "Project and inverse-transform batch",
      "Handle missing values before PCA",
      "Compare covariance vs correlation PCA",
      "Compute loading matrix",
      "Run PCA on standardized data",
    ],
    hard: [
      "Implement incremental PCA",
      "Compute PCA on large sparse matrix",
      "Apply PCA to streaming minibatches",
      "Stabilize eigen decomposition",
      "Implement randomized PCA",
      "Compare PCA and LDA on toy data",
      "Compute Mahalanobis distance after PCA",
      "Implement kernel PCA (RBF)",
      "Perform PCA with outlier filtering",
      "Align PCA components between datasets",
    ],
  },
  "cnn": {
    easy: [
      "Compute output size of conv layer",
      "Apply 1-channel convolution",
      "Add padding to an image",
      "Apply max pooling",
      "Compute number of parameters",
      "Apply ReLU to feature map",
      "Flatten feature map",
      "Compute softmax for logits",
      "Normalize image to [0,1]",
      "Compute stride-based output shape",
    ],
    medium: [
      "Implement multi-channel convolution",
      "Compute output after two conv layers",
      "Apply batch normalization on feature maps",
      "Implement dropout mask",
      "Compute receptive field size",
      "Implement global average pooling",
      "Compute gradient of ReLU",
      "Build a simple CNN forward pass",
      "Implement same vs valid padding",
      "Compute top-1 accuracy",
    ],
    hard: [
      "Implement backprop for conv kernel",
      "Optimize conv with im2col",
      "Compute FLOPs for a CNN block",
      "Implement depthwise separable conv",
      "Apply dilated convolution",
      "Compute output for stride and dilation",
      "Implement residual block forward",
      "Estimate memory for activations",
      "Implement group normalization",
      "Build a mini training loop",
    ],
  },
};

const buildPrompt = (topicTitle, task, variant) =>
  `${task} for ${topicTitle}. Use a ${variant.size} toy dataset.`;

const buildSummary = (task) => `${task} in a focused setting.`;

const buildExample = (topicSlug, variant) => {
  if (topicSlug === "k-means") {
    return {
      input: "points = [[1,2],[3,4],[10,10]], k = 2",
      output: "assignments = [0,0,1]",
    };
  }

  if (topicSlug === "cnn") {
    return {
      input: "image = [[1,0],[0,1]], kernel = [[1,1],[1,1]]",
      output: "output = [[2]]",
    };
  }

  return {
    input: "x = [1,2,3], y = [2,4,6]",
    output: "result = ...",
    explanation: `Example for ${variant.size} data.`,
  };
};

const starterCode = (topicTitle) => `def solve():
    """Write your ${topicTitle} solution here."""
    pass
`;

const generateProblemsForTopic = (topic) => {
  if (!topic.generatePractice) {
    return [];
  }
  const tasks = baseTasks[topic.slug];
  const difficulties = [
    { key: "easy", label: "EASY" },
    { key: "medium", label: "MEDIUM" },
    { key: "hard", label: "HARD" },
  ];

  const problems = [];

  difficulties.forEach(({ key, label }) => {
    tasks[key].forEach((task, taskIndex) => {
      variants.forEach((variant, variantIndex) => {
        const index = taskIndex * variants.length + variantIndex + 1;
        const slug = `${topic.slug}-${key}-${index}`;

        problems.push({
          slug,
          title: `${topic.title}: ${task} (${label} ${variant.label})`,
          summary: buildSummary(task),
          difficulty: label,
          tags: [...topic.tags, key],
          prompt: buildPrompt(topic.title, task, variant),
          inputFormat: "See the prompt for input details.",
          outputFormat: "Return the required values as described.",
          constraints: [
            `Dataset size: ${variant.size}`,
            "Use Python only, no external libraries.",
          ],
          starterCode: starterCode(topic.title),
          examples: [buildExample(topic.slug, variant)],
          topicSlug: topic.slug,
        });
      });
    });
  });

  return problems;
};

const problems = topics.flatMap(generateProblemsForTopic);

const upsertProblem = async (problem) => {
  const topic = await prisma.topic.findUnique({
    where: { slug: problem.topicSlug },
  });

  if (!topic) {
    throw new Error(`Missing topic: ${problem.topicSlug}`);
  }

  const tagData = problem.tags.map((tag) => ({
    tag: {
      connectOrCreate: {
        where: { name: tag },
        create: { name: tag },
      },
    },
  }));

  const exampleData = problem.examples.map((example, index) => ({
    input: example.input,
    output: example.output,
    explanation: example.explanation ?? null,
    order: index,
  }));

  await prisma.problem.upsert({
    where: { slug: problem.slug },
    create: {
      slug: problem.slug,
      title: problem.title,
      summary: problem.summary,
      difficulty: problem.difficulty,
      prompt: problem.prompt,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints,
      starterCode: problem.starterCode,
      topicId: topic.id,
      tags: { create: tagData },
      examples: { create: exampleData },
    },
    update: {
      title: problem.title,
      summary: problem.summary,
      difficulty: problem.difficulty,
      prompt: problem.prompt,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      constraints: problem.constraints,
      starterCode: problem.starterCode,
      topicId: topic.id,
      tags: {
        deleteMany: {},
        create: tagData,
      },
      examples: {
        deleteMany: {},
        create: exampleData,
      },
    },
  });
};

const main = async () => {
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: {
        slug: topic.slug,
        title: topic.title,
        category: topic.category,
        summary: topic.summary,
        theory: topic.theory,
        videoUrl: toEmbedUrl(topic.videoUrl),
      },
      update: {
        title: topic.title,
        category: topic.category,
        summary: topic.summary,
        theory: topic.theory,
        videoUrl: toEmbedUrl(topic.videoUrl),
      },
    });
  }

  for (const problem of problems) {
    await upsertProblem(problem);
  }
};

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
