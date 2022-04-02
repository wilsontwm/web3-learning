package response

// Item :
type Item struct {
	Item interface{} `json:"item"`
}

// Items :
type Items struct {
	Count  int         `json:"count"`
	Items  interface{} `json:"items"`
	Cursor string      `json:"cursor,omitempty"`
}
